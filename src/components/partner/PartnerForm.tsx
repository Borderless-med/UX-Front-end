
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PartnerFormFields from './PartnerFormFields';

interface PartnerFormData {
  clinicName: string;
  contactName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  registrationNumber: string;
  services: string;
  experience: string;
  whyJoin: string;
  sentimentAnalysisInterest: boolean;
  aiChatbotInterest: boolean;
}

interface PartnerFormProps {
  onSubmissionSuccess: () => void;
}

const PartnerForm = ({ onSubmissionSuccess }: PartnerFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<PartnerFormData>({
    defaultValues: {
      clinicName: '',
      contactName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      registrationNumber: '',
      services: '',
      experience: '',
      whyJoin: '',
      sentimentAnalysisInterest: false,
      aiChatbotInterest: false,
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    try {
      console.log('Submitting partner application:', data);

      // 1. Create Supabase Auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      let ownerUserId = signUpData.user?.id;

      // If user ID is not available, fetch user by email
      if (!ownerUserId) {
        const { data: userList, error: userFetchError } = await supabase.auth.admin.listUsers();
        if (userFetchError) {
          toast({
            title: "Signup Failed",
            description: "Could not retrieve user ID after signup.",
            variant: "destructive",
          });
          return;
        }
        // Find user by email
        const foundUser = userList.users.find((u: any) => u.email === data.email);
        ownerUserId = foundUser?.id;
      }

      if (!ownerUserId) {
        toast({
          title: "Signup Failed",
          description: "User ID not found after signup.",
          variant: "destructive",
        });
        return;
      }

      // 2. Insert partner application with owner_user_id
      const { error } = await supabase
        .from('partner_applications')
        .insert([
          {
            clinic_name: data.clinicName,
            contact_name: data.contactName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            registration_number: data.registrationNumber,
            services: data.services,
            experience: data.experience,
            why_join: data.whyJoin,
            sentiment_analysis_interest: data.sentimentAnalysisInterest,
            ai_chatbot_interest: data.aiChatbotInterest,
            owner_user_id: ownerUserId,
          }
        ]);

      if (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Application submitted successfully');
        onSubmissionSuccess();
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you within 5 business days.",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PartnerFormFields form={form} />
        {/* Add password field for signup */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...form.register('password', { required: true, minLength: 6 })}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a password"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white font-semibold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting Application...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit Partnership Application
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PartnerForm;
