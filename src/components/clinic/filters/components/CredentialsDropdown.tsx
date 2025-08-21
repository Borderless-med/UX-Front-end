import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { credentialOptions } from '../../utils/clinicConstants';
import { Award } from 'lucide-react';

interface CredentialsDropdownProps {
  selectedCredentials: string[];
  onCredentialsChange: (credentials: string[]) => void;
}

const CredentialsDropdown = ({
  selectedCredentials,
  onCredentialsChange
}: CredentialsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCredentialToggle = (credentialKey: string) => {
    const updatedCredentials = selectedCredentials.includes(credentialKey)
      ? selectedCredentials.filter(key => key !== credentialKey)
      : [...selectedCredentials, credentialKey];
    
    onCredentialsChange(updatedCredentials);
  };

  const getDisplayValue = () => {
    if (selectedCredentials.length === 0) {
      return "Any Credentials";
    }
    if (selectedCredentials.length === 1) {
      const credential = credentialOptions.find(c => c.key === selectedCredentials[0]);
      return credential?.label || "1 selected";
    }
    return `${selectedCredentials.length} selected`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-sidebar-foreground mb-2 flex items-center">
        <Award className="h-4 w-4 mr-2" />
        Credentials
      </label>
      
      <Select open={isOpen} onOpenChange={setIsOpen}>
        <SelectTrigger>
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        <SelectContent 
          className="w-full p-0" 
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
            {credentialOptions.map((credential) => (
              <div 
                key={credential.key} 
                className="flex items-center space-x-2 p-2 hover:bg-sidebar-accent rounded-sm cursor-pointer"
                onClick={() => handleCredentialToggle(credential.key)}
              >
                <Checkbox
                  id={credential.key}
                  checked={selectedCredentials.includes(credential.key)}
                  onChange={() => {}} // Handled by parent click
                />
                <label 
                  htmlFor={credential.key} 
                  className="text-sm text-sidebar-foreground cursor-pointer leading-tight flex-1"
                >
                  {credential.label}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>

      {/* Selected Credentials Badges */}
      {selectedCredentials.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCredentials.map((credentialKey) => {
            const credential = credentialOptions.find(c => c.key === credentialKey);
            return credential ? (
              <Badge 
                key={credentialKey} 
                variant="secondary" 
                className="text-xs"
              >
                {credential.label}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default CredentialsDropdown;