import React, { useState } from 'react';
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
}

const PDPARegistrationForm: React.FC<PDPARegistrationFormProps> = ({ 
  onSuccess, 
  onSwitchToLogin 
}) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    consentGiven: false,
  });
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
      purposeOfUse: 'Dental treatment and booking services',
      userCategory: 'patient' as const,
    };
    
    const result = await register(registrationData);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Registration failed');
    }
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
              onFocus={() => setError('')}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              disabled={isLoading}
              onFocus={() => setError('')}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a secure password (min. 6 characters)"
                disabled={isLoading}
                onFocus={() => setError('')}
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
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
              onFocus={() => setError('')}
            />
          </div>

          {/* PDPA Consent */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="pdpaConsent"
                checked={formData.consentGiven}
                onCheckedChange={(checked) => handleInputChange('consentGiven', !!checked)}
                disabled={isLoading}
                className="mt-1"
              />
              <div>
                <Label htmlFor="pdpaConsent" className="text-sm font-medium text-red-800">
                  PDPA Consent Required *
                </Label>
                <p className="text-xs text-red-700 mt-1 text-justify">
                  I consent to the collection, use and disclosure of my personal data for account creation, 
                  dental treatment coordination, and communication purposes. By creating an account, I agree 
                  to receive service updates and appointment reminders.{' '}
                  <a href="/privacy-policy" target="_blank" className="text-red-600 hover:text-red-800 underline">
                    Read our Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Auto-Population Notice */}
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
            Create Account
          </Button>
        </form>

        {/* Sign In Link */}
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
      </CardContent>
    </Card>
  );
};

export default PDPARegistrationForm;