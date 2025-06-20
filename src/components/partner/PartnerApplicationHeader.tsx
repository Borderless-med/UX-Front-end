
import { Building2 } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PartnerApplicationHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <div className="bg-[#FF6F61]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <Building2 className="h-8 w-8 text-[#FF6F61]" />
      </div>
      <CardTitle className="text-3xl font-bold text-blue-dark mb-2">
        Partner with SG-JB Dental
      </CardTitle>
      <CardDescription className="text-lg text-neutral-gray">
        Join our network of trusted dental clinics and connect with Singapore patients seeking quality, affordable care
      </CardDescription>
    </CardHeader>
  );
};

export default PartnerApplicationHeader;
