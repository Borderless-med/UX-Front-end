
import { Building2 } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PartnerApplicationHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <img src="/orachope.png" alt="OraChope.org Logo" style={{ width: 192, height: 'auto', margin: '0 auto 16px auto', display: 'block' }} />
      <CardTitle className="text-3xl font-bold text-blue-dark mb-2">
        Partner with OraChope.org
      </CardTitle>
      <CardDescription className="text-lg text-neutral-gray">
        Join our network of trusted dental clinics and connect with Singapore patients seeking quality, affordable care
      </CardDescription>
    </CardHeader>
  );
};

export default PartnerApplicationHeader;
