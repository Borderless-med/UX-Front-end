
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, Info, Eye, EyeOff } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type UserCategory = Database['public']['Enums']['user_category'];

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
    organization: '',
    purposeOfUse: '',
    userCategory: 'patient' as UserCategory,
    consentGiven: false,
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.fullName) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.purposeOfUse) {
        setError('Please specify your purpose for using the platform');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentGiven) {
      setError('You must consent to the PDPA notice to create an account');
      return;
    }

    const result = await register(formData.email, formData.password);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const getCategoryDescription = (category: UserCategory) => {
    switch (category) {
      case 'patient':
        return 'General public seeking dental care information';
      case 'healthcare_professional':
        return 'Licensed dental professionals and clinic staff';
      case 'clinic_admin':
        return 'Clinic owners and administrators';
      case 'approved_partner':
        return 'Verified partners (requires manual approval)';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-dark">
          <Shield className="h-5 w-5 text-blue-primary" />
          Create Account - Step {step} of 3
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                disabled={isLoading}
                onFocus={() => setError('')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="e.g., ABC Dental Clinic, Ministry of Health"
                disabled={isLoading}
                onFocus={() => setError('')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Choose a password (min. 6 characters)"
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

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleNext}
              className="w-full bg-blue-primary hover:bg-blue-dark"
              disabled={isLoading}
            >
              Next: Account Type
            </Button>
          </div>
        )}

        {/* Step 2: Account Type & Purpose */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userCategory">Account Type *</Label>
              <Select 
                value={formData.userCategory} 
                onValueChange={(value) => handleInputChange('userCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">
                    <div>
                      <div className="font-medium">Patient/General Public</div>
                      <div className="text-sm text-gray-500">
                        {getCategoryDescription('patient')}
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="healthcare_professional">
                    <div>
                      <div className="font-medium">Healthcare Professional</div>
                      <div className="text-sm text-gray-500">
                        {getCategoryDescription('healthcare_professional')}
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="clinic_admin">
                    <div>
                      <div className="font-medium">Clinic Administrator</div>
                      <div className="text-sm text-gray-500">
                        {getCategoryDescription('clinic_admin')}
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="approved_partner">
                    <div>
                      <div className="font-medium">Partner Organization</div>
                      <div className="text-sm text-gray-500">
                        {getCategoryDescription('approved_partner')}
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purposeOfUse">Purpose of Use *</Label>
              <Textarea
                id="purposeOfUse"
                value={formData.purposeOfUse}
                onChange={(e) => handleInputChange('purposeOfUse', e.target.value)}
                placeholder="Please describe how you plan to use this platform (e.g., seeking dental treatment, professional collaboration, clinic management)"
                className="min-h-[80px]"
                disabled={isLoading}
                onFocus={() => setError('')}
              />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Email Domain Detection:</strong> Healthcare professionals using 
                professional email domains will be automatically verified. Clinic 
                administrators may require manual verification.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="flex-1 bg-blue-primary hover:bg-blue-dark"
                disabled={isLoading}
              >
                Next: PDPA Consent
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: PDPA Consent */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">
                Personal Data Protection Act (PDPA) Notice
              </h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>
                  <strong>Data Collection:</strong> We collect your name, email, organization, 
                  and purpose of use to provide verified access to practitioner information.
                </p>
                <p>
                  <strong>Data Use:</strong> Your information enables us to display dentist names, 
                  qualifications, and MDC registration numbers in compliance with professional 
                  disclosure requirements.
                </p>
                <p>
                  <strong>Legal Basis:</strong> We process this data under deemed consent by 
                  notification and legitimate interests for professional collaboration.
                </p>
                <p>
                  <strong>Your Rights:</strong> You may withdraw consent at any time through 
                  your account settings or by contacting us directly.
                </p>
                <p>
                  <strong>Data Security:</strong> We implement appropriate technical and 
                  organizational measures to protect your personal data.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="pdpaConsent"
                checked={formData.consentGiven}
                onCheckedChange={(checked) => handleInputChange('consentGiven', !!checked)}
                disabled={isLoading}
              />
              <Label htmlFor="pdpaConsent" className="text-sm leading-normal">
                I acknowledge that I have read and understood the PDPA notice above. 
                I consent to the collection, use, and disclosure of my personal data 
                as described, and understand that I can withdraw this consent at any time.
              </Label>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-blue-primary hover:bg-blue-dark"
                disabled={isLoading || !formData.consentGiven}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-primary hover:text-blue-dark underline"
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
