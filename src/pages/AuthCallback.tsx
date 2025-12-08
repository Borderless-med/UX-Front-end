import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during OAuth callback:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (session) {
          console.log('OAuth login successful:', session.user.email);
          
          // Check if user has a profile in user_profiles table
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile) {
            // New OAuth user - create basic profile
            const providerData = session.user.user_metadata;
            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert({
                id: session.user.id,
                full_name: providerData.full_name || providerData.name || 'OAuth User',
                email_domain: session.user.email?.split('@')[1] || '',
                user_category: 'individual',
                purpose_of_use: 'platform_use',
              });

            if (insertError) {
              console.error('Error creating user profile:', insertError);
            }
          }

          // Redirect to home page using window.location for production
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Unexpected error during OAuth callback:', error);
        navigate('/login?error=unexpected', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mx-auto"></div>
        <p className="mt-4 text-neutral-gray">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
