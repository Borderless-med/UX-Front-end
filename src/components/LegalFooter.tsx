
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const LegalFooter = () => {
  const [openSections, setOpenSections] = React.useState<{[key: string]: boolean}>({
    disclaimer: false,
    privacy: false,
    terms: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const legalSections = [
    {
      id: 'disclaimer',
      title: 'Directory Disclaimer',
      content: (
        <div className="text-xs text-gray-500 leading-relaxed space-y-2">
          <p>
            <strong>DIRECTORY DISCLAIMER:</strong> The information provided on SG Smile Saver regarding dental clinics in Johor Bahru is compiled from publicly available sources for informational purposes only. We make no representation or warranty regarding the accuracy, completeness, or currency of this information.
          </p>
          <p>
            Listing of a dental clinic on this platform does not imply any business relationship, partnership, or endorsement between SG Smile Saver and the listed clinic. We have not verified the credentials, qualifications, or services of these clinics.
          </p>
          <p>
            Users are advised to conduct their own due diligence and directly contact clinics to verify all information before making any decisions. SG Smile Saver is not responsible for any outcomes resulting from interactions between users and listed clinics.
          </p>
          <p>
            Clinic owners who wish to update their information or have their listing removed may contact us at [your contact information].
          </p>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content: (
        <div className="text-xs text-gray-500 leading-relaxed">
          <p>
            SG Smile Saver Privacy Policy: We are committed to protecting your personal data in accordance with Singapore's Personal Data Protection Act (PDPA) and Malaysia's data protection regulations. We collect only essential information necessary to connect you with verified dental clinics in Johor Bahru, including your contact details, dental preferences, and appointment information. Your data is used solely to facilitate clinic referrals, improve our platform services, and communicate important updates about your dental care journey. We implement robust security measures to protect your information and will never sell your personal data to third parties. You have the right to access, correct, or request deletion of your personal data at any time by contacting our Data Protection Officer. For cross-border data transfers between Singapore and Malaysia, we ensure adequate protection measures are in place to safeguard your information.
          </p>
        </div>
      )
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      content: (
        <div className="text-xs text-gray-500 leading-relaxed">
          <p>
            SG Smile Saver Terms of Service: By using our platform, you agree to these terms which govern your access to our dental clinic directory and referral services connecting Singapore residents with Johor Bahru dental providers. Our platform serves as an information directory and referral service only - we do not provide direct medical or dental services. Users must be at least 18 years old or have parental consent, and are responsible for verifying all clinic information directly before making appointments. You agree not to misuse our platform through spam, false information, or attempts to circumvent our systems. While we strive to maintain accurate clinic information, we disclaim liability for any outcomes resulting from your interactions with listed dental providers. We reserve the right to suspend or terminate accounts that violate these terms, and any disputes will be resolved under Singapore law. These terms may be updated periodically, and continued use of our platform constitutes acceptance of any changes.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {legalSections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 group">
                  <span className="text-sm font-medium text-gray-700 text-left">
                    {section.title}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700 ${
                      openSections[section.id] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="p-4 bg-white border-x border-b border-gray-200 rounded-b-lg -mt-1">
                  {section.content}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalFooter;
