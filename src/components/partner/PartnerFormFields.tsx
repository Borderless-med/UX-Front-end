
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PartnerFormData {
  clinicName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationNumber: string;
  services: string;
  experience: string;
  whyJoin: string;
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
          name="clinicName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Clinic Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your Dental Clinic" {...field} required className="text-gray-900 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />

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
            <FormLabel className="text-gray-800 font-semibold">Clinic Address *</FormLabel>
            <FormControl>
              <Input placeholder="123 Medical Center, Johor Bahru" {...field} required className="text-gray-900 placeholder:text-gray-500" />
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

        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">MDC Registration Number *</FormLabel>
              <FormControl>
                <Input placeholder="MDC123456" {...field} required className="text-gray-900 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />
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

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 font-semibold">Years of Experience *</FormLabel>
            <FormControl>
              <Input placeholder="10 years" {...field} required className="text-gray-900 placeholder:text-gray-500" />
            </FormControl>
            <FormMessage className="text-red-600 font-medium" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="whyJoin"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 font-semibold">Why do you want to join our network? *</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us about your motivation to serve Singapore patients..." {...field} required className="text-gray-900 placeholder:text-gray-500 min-h-[120px]" />
            </FormControl>
            <FormMessage className="text-red-600 font-medium" />
          </FormItem>
        )}
      />
    </>
  );
};

export default PartnerFormFields;
