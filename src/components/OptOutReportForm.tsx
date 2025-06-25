
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
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

      if (error) {
        throw error;
      }

      toast({
        title: "Request Submitted Successfully",
        description: "We've received your request and will review it within 2-3 business days. You'll receive an email confirmation shortly.",
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

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-dark">
          Submit Your Request
        </CardTitle>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input placeholder="Enter clinic name" {...field} />
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
                      <Input placeholder="Enter clinic ID" {...field} />
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
