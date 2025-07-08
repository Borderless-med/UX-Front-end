
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Building2, CheckCircle } from 'lucide-react';

const TestClinicSignupForm = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clinicName: '',
    clinicRole: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');

  const clinicRoles = [
    { value: 'clinic_admin', label: 'Clinic Administrator' },
    { value: 'dentist', label: 'Dentist' },
    { value: 'dental_hygienist', label: 'Dental Hygienist' },
    { value: 'practice_manager', label: 'Practice Manager' },
    { value: 'receptionist', label: 'Receptionist' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password || !formData.clinicName || !formData.clinicRole) {
      setError('All fields are required');
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      fullName: `${formData.clinicName} Staff`, // Using clinic name as part of full name
      organization: formData.clinicName, // Mapping clinic name to organization
      purposeOfUse: formData.clinicRole, // Mapping clinic role to purpose of use
      userCategory: 'clinic_admin', // Setting user category as clinic_admin
      consentGiven: true
    });
    
    if (result.success) {
      setSuccess(true);
      // Generate a mock user ID for display (in real scenario, this would come from the auth response)
      setUserId(`clinic-test-${Date.now()}`);
      setFormData({ email: '', password: '', clinicName: '', clinicRole: '' });
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Clinic Signup Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              <strong>Test signup completed successfully!</strong>
            </p>
            <p className="text-sm text-green-700">
              Please verify the data in your Supabase dashboard:
            </p>
            <ul className="text-xs text-green-600 mt-2 space-y-1">
              <li>• Check Auth → Users for the email/password</li>
              <li>• Check Database → user_profiles table</li>
              <li>• Look for organization = clinic name</li>
              <li>• Look for purpose_of_use = clinic role</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => setSuccess(false)}
            className="w-full"
            variant="outline"
          >
            Test Another Signup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-dark">
          <Building2 className="h-5 w-5 text-blue-primary" />
          Test Clinic Signup
        </CardTitle>
        <p className="text-sm text-gray-600">
          This is a test form to verify Supabase backend integration
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="clinic@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              type="text"
              placeholder="ABC Dental Clinic"
              value={formData.clinicName}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicRole">Clinic Role</Label>
            <Select 
              value={formData.clinicRole} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, clinicRole: value }))}
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {clinicRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit"
            className="w-full bg-blue-primary hover:bg-blue-dark"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Test Clinic Signup
          </Button>
        </form>

        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>For Testing:</strong> This form maps clinic data to existing user_profiles fields:
            clinic_name → organization, clinic_role → purpose_of_use, user_category → clinic_admin
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestClinicSignupForm;
