import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PDPAConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PDPAConsentCheckbox: React.FC<PDPAConsentCheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="giveaway-pdpa"
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="mt-0.5"
        />
        <div>
          <Label
            htmlFor="giveaway-pdpa"
            className="text-xs font-medium text-red-800 cursor-pointer"
          >
            I agree to the PDPA terms *
          </Label>
          <p className="text-[10px] text-red-700 mt-1 leading-tight">
            I consent to the collection, use and disclosure of my personal data for giveaway entry,
            dental service recommendations, and communications.{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-red-600 hover:text-red-800 underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDPAConsentCheckbox;
