
import React, { useState } from 'react';
import PasswordResetForm from './PasswordResetForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  console.log('LoginForm rendered');
  const { login, loginWithGoogle, loginWithFacebook, loginWithApple, isLoading } = useAuth();
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setError('');
    console.log('Login form submitted:', email, password);
    const result = await login(email, password);
    console.log('Login result:', result);

    if (result.success) {
      setEmail('');
      setPassword('');
      onSuccess();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setError('');
    let result;
    
    if (provider === 'google') {
      result = await loginWithGoogle();
    } else if (provider === 'facebook') {
      result = await loginWithFacebook();
    } else {
      result = await loginWithApple();
    }

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <>
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
            <PasswordResetForm onClose={() => setShowReset(false)} />
          </div>
        </div>
      )}
      <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-dark">
          <Shield className="h-5 w-5 text-blue-primary" />
          Sign In to Your Account
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-dark">
            Sign in to view detailed clinic information including dentist names and credentials. You'll also get access to your chat history and past transactions on this platform.
          </p>
        </div>

        {/* OAuth Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-11"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-11"
            onClick={() => handleOAuthLogin('facebook')}
            disabled={isLoading}
            type="button"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-11"
            onClick={() => handleOAuthLogin('apple')}
            disabled={isLoading}
            type="button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
          </div>
        </div>

  <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                className="text-blue-primary hover:text-blue-dark text-xs underline"
                onClick={() => setShowReset(true)}
              >
                Forgot My Password?
              </button>
            </div>
          </div>
          
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <button 
            type="submit"
            className="w-full bg-blue-primary hover:bg-blue-dark py-2 px-4 rounded text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sign In
          </button>
        </form>

  <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-primary hover:text-blue-dark underline"
            
          >
            Create one here
          </button>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default LoginForm;
