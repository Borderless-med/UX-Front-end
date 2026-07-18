import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, Eye, EyeOff, Info } from 'lucide-react';

interface PDPARegistrationFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  submitButtonText?: string;
  registrationSource?: string;
  hideLoginLink?: boolean;
  compactLayout?: boolean;
}

const PDPARegistrationForm: React.FC<PDPARegistrationFormProps> = ({ 
  onSuccess, 
  onSwitchToLogin,
  submitButtonText = 'Create Account',
  registrationSource = 'Dental treatment and booking services',
  hideLoginLink = false,
  compactLayout = false
}) => {
  const { register, loginWithGoogle, loginWithFacebook, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    consentGiven: false,
  });

  // Prevent browser autofill
  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
      inputs.forEach(input => {
        (input as HTMLInputElement).value = '';
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.consentGiven) {
      setError('You must consent to the PDPA notice to create an account');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare registration data with auto-populated values
    const registrationData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      // Auto-populated values for simplified registration
      organization: '', // Empty for most users
      purposeOfUse: registrationSource,
      userCategory: 'patient' as const,
    };
    
    const result = await register(registrationData);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setError('');
    let result;
    
    if (provider === 'google') {
      result = await loginWithGoogle();
    } else {
      result = await loginWithFacebook();
    }

    if (!result.success && result.error) {
      setError(result.error);
    }
    // Note: OAuth will redirect on success
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-dark">
          <Shield className="h-5 w-5 text-blue-primary" />
          Create Your Account
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Join thousands of patients getting better dental care
        </p>
      </CardHeader>
      
      <CardContent>
        {/* OAuth Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 font-semibold flex items-center justify-center gap-3"
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
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            disabled={isLoading}
            className="w-full h-11 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">Or sign up with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Name and Email - 2 columns on compact layout */}
          <div className={compactLayout ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullname-signup"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
                onFocus={() => setError('')}
                autoComplete="off"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email-signup"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                disabled={isLoading}
                onFocus={() => setError('')}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                name="new-password-signup"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a secure password (min. 6 characters)"
                disabled={isLoading}
                onFocus={() => setError('')}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirm-password-signup"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
              onFocus={() => setError('')}
              autoComplete="new-password"
            />
          </div>

          {/* PDPA Consent */}
          <div className={`bg-red-50 rounded-lg border border-red-200 ${compactLayout ? 'p-2 space-y-1' : 'p-4 space-y-3'}`}>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="pdpaConsent"
                checked={formData.consentGiven}
                onCheckedChange={(checked) => handleInputChange('consentGiven', !!checked)}
                disabled={isLoading}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="pdpaConsent" className={`font-medium text-red-800 ${compactLayout ? 'text-xs' : 'text-sm'}`}>
                  PDPA Consent Required *
                </Label>
                <p className={`text-red-700 mt-0.5 ${compactLayout ? 'text-[10px] leading-tight' : 'text-xs'}`}>
                  I consent to the collection, use and disclosure of my personal data for account creation, 
                  dental treatment coordination, and communication purposes.{' '}
                  <a href="/privacy-policy" target="_blank" className="text-red-600 hover:text-red-800 underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Auto-Population Notice */}
          {!compactLayout && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-1 rounded-full flex-shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-800">Auto-Configuration</div>
                <p className="text-xs text-blue-700 mt-1">
                  Your account will be automatically configured as a <strong>Patient</strong> for 
                  <strong> Dental treatment and booking services</strong>. No additional setup required!
                </p>
              </div>
            </div>
          </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-blue-primary hover:bg-blue-dark h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {submitButtonText}
          </Button>
        </form>

        {/* Sign In Link */}
        {!hideLoginLink && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-primary hover:text-blue-dark underline font-medium"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDPARegistrationForm;