
import React, { useState } from 'react';
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
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <Card className="w-full max-w-md mx-auto">
      {console.log('LoginForm JSX rendered')}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {console.log('Form rendered')}
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
          </div>
          
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit"
            className="w-full bg-blue-primary hover:bg-blue-dark"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {console.log('Button rendered')}
            Sign In
          </Button>
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
  );
};

export default LoginForm;
