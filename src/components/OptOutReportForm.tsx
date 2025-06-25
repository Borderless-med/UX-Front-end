
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  requestType: z.enum(['opt_out', 'incorrect_info', 'technical_issue', 'other']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  clinicName: z.string().optional(),
  clinicId: z.string().optional(),
  description: z.string().min(10, 'Please provide at least 10 characters of detail'),
});

type FormData = z.infer<typeof formSchema>;

const OptOutReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: undefined,
      name: '',
      email: '',
      phone: '',
      clinicName: '',
      clinicId: '',
      description: '',
    },
  });

  // Pre-populate form with URL parameters if provided
  useEffect(() => {
    const clinicName = searchParams.get('clinic');
    const clinicId = searchParams.get('clinicId');
    
    if (clinicName || clinicId) {
      form.setValue('clinicName', clinicName || '');
      form.setValue('clinicId', clinicId || '');
      form.setValue('requestType', 'opt_out');
      
      // Pre-populate description for clinic-specific requests
      if (clinicName) {
        form.setValue('description', `I am requesting the removal of ${clinicName} from the SG-JB Dental directory. I am the clinic owner/authorized representative and would like this listing to be removed from all search results and directory pages.`);
      }
    }
  }, [searchParams, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert the opt-out request
      const { error: insertError } = await supabase
        .from('opt_out_reports')
        .insert({
          request_type: data.requestType,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          clinic_name: data.clinicName || null,
          clinic_id: data.clinicId || null,
          description: data.description,
        });

      if (insertError) {
        throw insertError;
      }

      // Call edge function to send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-opt-out-confirmation', {
        body: {
          email: data.email,
          name: data.name,
          requestType: data.requestType,
          clinicName: data.clinicName,
        },
      });

      if (emailError) {
        console.warn('Email confirmation failed:', emailError);
        // Don't throw here - the request was still submitted successfully
      }

      toast({
        title: "Request Submitted Successfully",
        description: "We've received your request and will review it within 2-3 business days. You'll receive an email confirmation shortly.",
        duration: 6000,
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestTypes = [
    { value: 'opt_out', label: 'Remove My Clinic Listing' },
    { value: 'incorrect_info', label: 'Report Incorrect Clinic Information' },
    { value: 'technical_issue', label: 'Report Technical Issue' },
    { value: 'other', label: 'Other Request' },
  ];

  const isClinicSpecificRequest = searchParams.get('clinic') || searchParams.get('clinicId');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-dark">
          {isClinicSpecificRequest ? 'Remove Clinic Listing' : 'Submit Your Request'}
        </CardTitle>
        {isClinicSpecificRequest && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Clinic Information Pre-filled</p>
                <p>We've automatically filled in the clinic details. Please review and complete the remaining fields.</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-dark font-medium">Request Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of request" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-dark font-medium">Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-dark font-medium">Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-dark font-medium">Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-dark font-medium">Clinic Name (If applicable)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter clinic name" 
                        {...field}
                        className={isClinicSpecificRequest ? "bg-blue-50 border-blue-200" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-dark font-medium">Clinic ID (If known)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter clinic ID" 
                        {...field}
                        className={isClinicSpecificRequest ? "bg-blue-50 border-blue-200" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-dark font-medium">Detailed Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide detailed information about your request, including specific issues or information that needs to be corrected..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-light/10 p-4 rounded-lg">
              <p className="text-sm text-neutral-gray">
                <strong>Processing Time:</strong> We typically process requests within 2-3 business days. 
                You'll receive an email confirmation and updates on the status of your request.
              </p>
            </div>

            {isClinicSpecificRequest && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>PDPA Compliance:</strong> As a clinic owner, you have the right to request removal of your listing. 
                  This request will be processed in compliance with Malaysian data protection regulations.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-primary hover:bg-blue-dark text-white py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OptOutReportForm;
