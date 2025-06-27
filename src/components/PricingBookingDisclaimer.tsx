
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const PricingBookingDisclaimer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full">
      <div className="space-y-4">
        {/* Always Visible Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-dark mb-3">
            Pricing & Booking Information
          </h3>
          <p className="text-sm text-blue-dark font-medium mb-4">
            <strong>Important:</strong> Contact our platform team at [contact details] to verify current pricing and availability before visiting providers. All pricing shown is indicative only. We facilitate bookings and verify current rates for you. Not medical advice.
          </p>
        </div>

        {/* Collapsible Section */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-blue-primary hover:text-blue-dark transition-colors text-sm font-medium">
            <Info className="h-4 w-4" />
            <span>View detailed disclaimer</span>
            <ChevronDown 
              className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} 
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="space-y-4 text-sm text-blue-dark bg-white border border-blue-100 rounded-md p-4">
              <p>
                The treatment options and pricing information shown on this platform are sourced from publicly available data and participating providers' published rates. This information is provided for reference only and may not reflect current pricing or availability.
              </p>
              
              <p>
                Because treatment costs can vary according to individual patient conditions, care complexity, additional services, and other factors, the actual fees may differ from the indicative prices displayed.
              </p>
              
              <p>
                To receive accurate, up-to-date pricing and availability—and to help us continue serving you—please contact our platform team at [contact details] before making any healthcare decisions or commitments. Direct inquiries to providers may bypass our service and jeopardize our ability to operate.
              </p>
              
              <p className="font-medium">
                This information does not constitute medical advice. For personalized clinical guidance, please consult qualified healthcare professionals.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default PricingBookingDisclaimer;
