// lib/supabaseConfig.ts
// Configuration helper for Supabase authentication providers

/**
 * Supabase OAuth Providers Configuration Guide
 * 
 * To enable Google OAuth in your Supabase project:
 * 
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project
 * 3. Enable "Google+ API"
 * 4. Create OAuth 2.0 credentials (Create > OAuth client ID > Web application)
 * 5. Add authorized redirect URI: https://your-project.supabase.co/auth/v1/callback
 * 6. Copy Client ID and Client Secret
 * 7. Go to Supabase Dashboard > Authentication > Providers
 * 8. Select Google and paste the credentials
 * 9. Enable the provider
 * 10. Add your production domain to Google OAuth authorized redirect URIs
 */

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  DISCORD: 'discord',
} as const;

export const AUTH_CONFIG = {
  // Redirect URL after successful OAuth callback
  redirectUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Email confirmation settings
  emailConfirmationRequired: true,
  
  // Password requirements
  passwordMinLength: 8,
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false,
  },
};

export default AUTH_CONFIG;
