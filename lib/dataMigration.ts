import { supabase } from './supabase'
import { Report, StoredDocument, IncidentTemplate, UserProfile } from '../types'

export interface LocalStorageData {
  reports: Report[]
  documents: StoredDocument[]
  incidentTemplates: IncidentTemplate[]
  userProfile: UserProfile | null
}

/**
 * Migration service to move data from localStorage to Supabase
 */
export class DataMigrationService {
  
  /**
   * Get all data from localStorage
   */
  static getLocalStorageData(): LocalStorageData {
    try {
      const reports = JSON.parse(localStorage.getItem('reports') || '[]')
      const documents = JSON.parse(localStorage.getItem('documents') || '[]')
      const incidentTemplates = JSON.parse(localStorage.getItem('incidentTemplates') || '[]')
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null')
      
      return {
        reports,
        documents,
        incidentTemplates,
        userProfile
      }
    } catch (error) {
      console.error('Error reading localStorage data:', error)
      return {
        reports: [],
        documents: [],
        incidentTemplates: [],
        userProfile: null
      }
    }
  }

  /**
   * Migrate all data from localStorage to Supabase for authenticated user
   */
  static async migrateToSupabase(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const localData = this.getLocalStorageData()
      
      // Migrate reports
      if (localData.reports.length > 0) {
        const reportsToInsert = localData.reports.map(report => ({
          id: report.id,
          user_id: userId,
          content: report.content,
          category: report.category,
          tags: report.tags,
          legal_context: report.legalContext || null,
          images: report.images,
          created_at: report.createdAt,
          updated_at: report.createdAt
        }))

        const { error: reportsError } = await supabase
          .from('reports')
          .upsert(reportsToInsert, { onConflict: 'id' })
        
        if (reportsError) throw reportsError
      }

      // Migrate documents
      if (localData.documents.length > 0) {
        const documentsToInsert = localData.documents.map(doc => ({
          id: doc.id,
          user_id: userId,
          name: doc.name,
          mime_type: doc.mimeType,
          data: doc.data,
          folder: doc.folder,
          structured_data: doc.structuredData || null,
          created_at: doc.createdAt,
          updated_at: doc.createdAt
        }))

        const { error: documentsError } = await supabase
          .from('documents')
          .upsert(documentsToInsert, { onConflict: 'id' })
        
        if (documentsError) throw documentsError
      }

      // Migrate templates
      if (localData.incidentTemplates.length > 0) {
        const templatesToInsert = localData.incidentTemplates.map(template => ({
          id: template.id,
          user_id: userId,
          title: template.title,
          content: template.content,
          category: template.category,
          tags: template.tags,
          legal_context: template.legalContext || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        const { error: templatesError } = await supabase
          .from('incident_templates')
          .upsert(templatesToInsert, { onConflict: 'id' })
        
        if (templatesError) throw templatesError
      }

      return { success: true }
    } catch (error) {
      console.error('Migration error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Load user data from Supabase
   */
  static async loadFromSupabase(userId: string): Promise<LocalStorageData> {
    try {
      // Load reports
      const { data: reports = [] } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Load documents
      const { data: documents = [] } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Load templates
      const { data: templates = [] } = await supabase
        .from('incident_templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Load user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      // Transform to local format
      const transformedReports: Report[] = reports.map(r => ({
        id: r.id,
        content: r.content,
        category: r.category,
        tags: r.tags || [],
        legalContext: r.legal_context,
        images: r.images || [],
        createdAt: r.created_at
      }))

      const transformedDocuments: StoredDocument[] = documents.map(d => ({
        id: d.id,
        name: d.name,
        mimeType: d.mime_type,
        data: d.data,
        folder: d.folder as any,
        structuredData: d.structured_data as any,
        createdAt: d.created_at
      }))

      const transformedTemplates: IncidentTemplate[] = templates.map(t => ({
        id: t.id,
        title: t.title,
        content: t.content,
        category: t.category as any,
        tags: t.tags || [],
        legalContext: t.legal_context
      }))

      const transformedProfile: UserProfile | null = userProfile ? {
        name: userProfile.name || '',
        role: userProfile.role || '',
        children: userProfile.children || []
      } : null

      return {
        reports: transformedReports,
        documents: transformedDocuments,
        incidentTemplates: transformedTemplates,
        userProfile: transformedProfile
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error)
      return {
        reports: [],
        documents: [],
        incidentTemplates: [],
        userProfile: null
      }
    }
  }

  /**
   * Clear localStorage after successful migration
   */
  static clearLocalStorage(): void {
    try {
      localStorage.removeItem('reports')
      localStorage.removeItem('documents')
      localStorage.removeItem('incidentTemplates')
      localStorage.removeItem('userProfile')
      console.log('localStorage cleared after successful migration')
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  /**
   * Check if user has data in localStorage that needs migration
   */
  static hasLocalData(): boolean {
    const localData = this.getLocalStorageData()
    return localData.reports.length > 0 || 
           localData.documents.length > 0 || 
           localData.incidentTemplates.length > 0 ||
           localData.userProfile !== null
  }
}