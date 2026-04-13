
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface PartnerFormData {
  clinicSource: 'jb' | 'sg';
  clinicId: string;
  clinicName: string;
  contactName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  mdcRegistrationNumber: string;
  clinicLicense: string;
  services: string;
  sentimentAnalysisInterest: boolean;
  marketAnalysisInterest: boolean;
  aiChatbotInterest: boolean;
  otherAiFeatures: string;
}

interface PartnerFormFieldsProps {
  form: UseFormReturn<PartnerFormData>;
}

const PartnerFormFields = ({ form }: PartnerFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Contact Person *</FormLabel>
              <FormControl>
                <Input placeholder="Dr. John Smith" {...field} required className="text-gray-900 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Email Address *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="clinic@example.com" {...field} required className="text-gray-900 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Phone Number *</FormLabel>
              <FormControl>
                <Input placeholder="+60 12 345 6789" {...field} required className="text-gray-900 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 font-semibold">
              📍 Clinic Address <span className="text-xs font-normal text-blue-600">(auto-filled)</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                readOnly 
                placeholder="Select a clinic to auto-fill address" 
                className="text-gray-900 placeholder:text-gray-500 bg-blue-50 border-blue-200 cursor-not-allowed" 
              />
            </FormControl>
            <FormMessage className="text-red-600 font-medium" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">City *</FormLabel>
              <FormControl>
                <Input placeholder="Johor Bahru" {...field} required className="text-gray-900 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Professional Registration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clinicLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">🏥 Clinic License (Form 7) *</FormLabel>
                <FormControl>
                  <Input placeholder="230102-00157-12" {...field} required className="text-gray-900 placeholder:text-gray-500 font-mono" />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
                <p className="text-xs text-gray-600 mt-1">Format: <span className="font-mono text-blue-600">230102-00157-12</span> (Ministry of Health Form 7)</p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mdcRegistrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">👨‍⚕️ Dentist License (MDC) *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your MDC registration number" {...field} required className="text-gray-900 placeholder:text-gray-500" />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
                <p className="text-xs text-gray-600 mt-1">Malaysian Dental Council registration number</p>
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="services"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 font-semibold">Services Offered *</FormLabel>
            <FormControl>
              <Textarea placeholder="General Dentistry, Orthodontics, Dental Implants, etc." {...field} required className="text-gray-900 placeholder:text-gray-500 min-h-[100px]" />
            </FormControl>
            <FormMessage className="text-red-600 font-medium" />
          </FormItem>
        )}
      />

      <div className="space-y-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Features Early Access (Optional)</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="sentimentAnalysisInterest"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-800 font-medium">
                      Clinic's Sentiment Analysis - Patient review insights dashboard
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketAnalysisInterest"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-800 font-medium">
                      Market Analysis - Competitive insights and trends
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiChatbotInterest"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-800 font-medium">
                      AI Chatbot integration for clinic operations
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherAiFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">Others (please specify):</FormLabel>
                  <FormControl>
                    <Input placeholder="Specify other AI features you're interested in..." {...field} className="text-gray-900 placeholder:text-gray-500" />
                  </FormControl>
                  <FormMessage className="text-red-600 font-medium" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerFormFields;
