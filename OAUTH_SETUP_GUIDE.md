# OAuth Authentication Setup Guide

## Overview
This guide will help you enable Google, Facebook, and Apple OAuth authentication for your sg-smile-saver application using Supabase Auth.

## Current Implementation
Your app currently uses:
- Email/Password authentication with JWT tokens
- Supabase Auth for user management
- `AuthContext` for state management

## Benefits of Adding OAuth
- **Better User Experience**: One-click login without password management
- **Security**: Leverages trusted identity providers
- **Reduced Friction**: Faster signup/login process
- **Social Integration**: Access to profile information (with user consent)

---

## Part 1: Supabase Dashboard Configuration

### 1.1 Google OAuth Setup

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted
6. Select **Web Application** as application type
7. Add authorized redirect URIs:
   ```
   https://uzppuebjzqxeavgmwtvr.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**

#### Step 2: Enable Google in Supabase
1. Go to your Supabase Dashboard > Authentication > Providers
2. Click on **Google** in the provider list
3. Toggle **Enable Sign in with Google** to ON
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

### 1.2 Facebook OAuth Setup

#### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Consumer** as app type
4. Fill in app name and contact email
5. Go to **Settings** > **Basic**
6. Copy **App ID** and **App Secret**
7. Add your app domains (e.g., `orachope.org`)

#### Step 2: Configure Facebook Login Product
1. In your Facebook App, go to **Products** > **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Select **Web** as platform
4. Add OAuth Redirect URI:
   ```
   https://uzppuebjzqxeavgmwtvr.supabase.co/auth/v1/callback
   ```
5. Go to **Facebook Login** > **Settings**
6. Add the redirect URI to **Valid OAuth Redirect URIs**

#### Step 3: Enable Facebook in Supabase
1. Go to Supabase Dashboard > Authentication > Providers
2. Click on **Facebook**
3. Toggle **Enable Sign in with Facebook** to ON
4. Paste your **App ID** (as Client ID) and **App Secret** (as Client Secret)
5. Click **Save**

---

### 1.3 Apple OAuth Setup

#### Step 1: Apple Developer Configuration
1. Go to [Apple Developer Account](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a **Services ID** (this is your Client ID)
4. Enable **Sign In with Apple** for your Services ID
5. Configure domains and return URLs:
   - Domains: `uzppuebjzqxeavgmwtvr.supabase.co`
   - Return URL: `https://uzppuebjzqxeavgmwtvr.supabase.co/auth/v1/callback`

#### Step 2: Generate Private Key
1. In Apple Developer, go to **Keys**
2. Create a new key and enable **Sign In with Apple**
3. Download the `.p8` private key file (only available once!)
4. Note the **Key ID**

#### Step 3: Get Team ID
1. In Apple Developer, click your name in top right
2. Note your **Team ID** (10 characters)

#### Step 4: Enable Apple in Supabase
1. Go to Supabase Dashboard > Authentication > Providers
2. Click on **Apple**
3. Toggle **Enable Sign in with Apple** to ON
4. Fill in:
   - **Services ID** (Client ID)
   - **Team ID**
   - **Key ID**
   - **Private Key** (contents of the .p8 file)
5. Click **Save**

---

## Part 2: Frontend Implementation

### 2.1 Update AuthContext

Add OAuth login methods to your `AuthContext.tsx`:

```typescript
// Add to AuthContextType interface
interface AuthContextType {
  // ... existing methods
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
}

// Add to AuthProvider component
const loginWithGoogle = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    setIsLoading(false);
  }
};

const loginWithFacebook = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    setIsLoading(false);
  }
};

const loginWithApple = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    setIsLoading(false);
  }
};

// Update the Provider value
return (
  <AuthContext.Provider value={{ 
    user, 
    session, 
    isLoading, 
    sessionId, 
    setSessionId, 
    login, 
    register, 
    logout,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple
  }}>
    {children}
  </AuthContext.Provider>
);
```

### 2.2 Create OAuth Callback Handler

Create a new page to handle OAuth callbacks:

```typescript
// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during OAuth callback:', error);
        navigate('/login?error=oauth_failed');
        return;
      }

      if (session) {
        // Check if user has completed profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // New OAuth user - redirect to complete profile
          navigate('/complete-profile');
        } else {
          // Existing user - redirect to home
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
```

### 2.3 Update Login Component

Add OAuth buttons to your login form:

```typescript
import { useAuth } from '@/contexts/AuthContext';

// Inside your login component
const { loginWithGoogle, loginWithFacebook, loginWithApple } = useAuth();

const handleGoogleLogin = async () => {
  const result = await loginWithGoogle();
  if (!result.success) {
    // Show error message
    toast({
      title: "Login Failed",
      description: result.error,
      variant: "destructive",
    });
  }
};

// Similar handlers for Facebook and Apple

// Add buttons to your JSX
<div className="space-y-3">
  <Button
    variant="outline"
    className="w-full flex items-center justify-center gap-2"
    onClick={handleGoogleLogin}
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      {/* Google icon SVG */}
    </svg>
    Continue with Google
  </Button>

  <Button
    variant="outline"
    className="w-full flex items-center justify-center gap-2"
    onClick={() => loginWithFacebook()}
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      {/* Facebook icon SVG */}
    </svg>
    Continue with Facebook
  </Button>

  <Button
    variant="outline"
    className="w-full flex items-center justify-center gap-2"
    onClick={() => loginWithApple()}
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      {/* Apple icon SVG */}
    </svg>
    Continue with Apple
  </Button>
</div>

<div className="relative my-4">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
  </div>
</div>

{/* Your existing email/password form */}
```

---

## Part 3: Database Setup

### 3.1 Handle OAuth User Profiles

OAuth users need their profile data stored. Add a trigger or modify your registration flow:

```sql
-- This trigger automatically creates a user_profile when an OAuth user signs up
CREATE OR REPLACE FUNCTION handle_new_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_app_meta_data->>'provider' IN ('google', 'facebook', 'apple') THEN
    INSERT INTO public.user_profiles (id, full_name, email_domain, user_category, purpose_of_use)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'OAuth User'),
      SPLIT_PART(NEW.email, '@', 2),
      'individual',
      'platform_use'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_oauth_user();
```

---

## Part 4: Testing

### 4.1 Local Testing
1. Ensure your local environment has proper redirect URIs configured
2. Add `http://localhost:5173/auth/callback` to authorized redirect URIs in each provider
3. Test each OAuth provider in incognito mode to avoid cache issues

### 4.2 Production Testing
1. Verify all redirect URIs use your production domain
2. Test on multiple devices and browsers
3. Monitor Supabase Auth logs for errors

---

## Part 5: Security Considerations

### 5.1 User Data Handling
- OAuth providers give you access to user profile data
- Only request permissions you actually need
- Store minimal user data from OAuth providers
- Respect user privacy preferences

### 5.2 JWT Token Management
- Your existing JWT implementation remains unchanged
- OAuth users get the same JWT tokens as email users
- Session management works identically for both auth methods

### 5.3 Account Linking
Consider implementing account linking if users want to add OAuth to existing email accounts:

```typescript
const linkGoogleAccount = async () => {
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'google'
  });
  
  if (error) {
    console.error('Failed to link Google account:', error);
  }
};
```

---

## Troubleshooting

### Common Issues

**Issue**: "Invalid redirect URI"
- **Solution**: Double-check all redirect URIs match exactly (including trailing slashes)

**Issue**: "OAuth popup blocked"
- **Solution**: Users need to allow popups, or use redirect mode instead

**Issue**: Apple Sign In shows "invalid_client"
- **Solution**: Verify your Services ID, Team ID, and Key ID are correct

**Issue**: User profile not created for OAuth users
- **Solution**: Check that the database trigger is properly installed

---

## Next Steps

1. **Start with Google OAuth** - It's the easiest to set up and most commonly used
2. **Test thoroughly** - Try signup and login flows multiple times
3. **Add Facebook** - Similar to Google but requires app review for production
4. **Add Apple** - Required if you plan to publish iOS app
5. **Monitor usage** - Check Supabase Auth logs to see which providers users prefer

---

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)

---

## Support

If you encounter issues:
1. Check Supabase Auth logs in your dashboard
2. Review browser console for errors
3. Verify all credentials are correctly configured
4. Test with different browsers/devices
