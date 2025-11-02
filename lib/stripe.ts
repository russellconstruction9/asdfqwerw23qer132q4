import { loadStripe } from '@stripe/stripe-js'
import { SubscriptionTier } from '../types'

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!)

export const getStripe = () => stripePromise

export interface PricingPlan {
  tier: SubscriptionTier
  name: string
  price: number
  priceId: string
  features: string[]
  popular?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: 'Free',
    name: 'Free',
    price: 0,
    priceId: '',
    features: [
      'Basic incident logging',
      'Up to 50K AI tokens/month',
      'Timeline view',
      'Local data storage'
    ]
  },
  {
    tier: 'Plus',
    name: 'Plus',
    price: 29,
    priceId: process.env.VITE_STRIPE_PLUS_PRICE_ID!,
    features: [
      'Everything in Free',
      'Pattern analysis',
      'Document library',
      'Legal assistant',
      'Up to 500K AI tokens/month',
      'Cloud data sync'
    ],
    popular: true
  },
  {
    tier: 'Pro',
    name: 'Pro',
    price: 79,
    priceId: process.env.VITE_STRIPE_PRO_PRICE_ID!,
    features: [
      'Everything in Plus',
      'Deep behavioral insights',
      'Voice AI agent',
      'Evidence package builder',
      'Up to 5M AI tokens/month',
      'Priority support'
    ]
  }
]

export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    })

    const session = await response.json()
    
    if (session.error) {
      throw new Error(session.error)
    }

    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      sessionId: session.id,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const createPortalSession = async (customerId: string) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    })

    const session = await response.json()
    
    if (session.error) {
      throw new Error(session.error)
    }

    window.location.href = session.url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}