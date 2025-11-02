import React, { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

interface AuthComponentProps {
  view?: 'sign_in' | 'sign_up'
  onAuthSuccess?: () => void
}

const AuthComponent: React.FC<AuthComponentProps> = ({ view = 'sign_in', onAuthSuccess }) => {
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CustodyX.AI</h1>
        <p className="text-gray-600 mt-2">
          {view === 'sign_up' ? 'Create your account' : 'Sign in to your account'}
        </p>
      </div>

      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#1e3a8a',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        theme="light"
        providers={[]}
        redirectTo={window.location.origin}
        onlyThirdPartyProviders={false}
        magicLink={false}
      />

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default AuthComponent