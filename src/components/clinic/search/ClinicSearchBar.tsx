
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ClinicSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClinicSearchBar = ({ searchTerm, onSearchChange }: ClinicSearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray h-4 w-4" />
      <Input
        type="text"
        placeholder="Search by clinic name, dentist, or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border-blue-light focus:border-blue-primary"
      />
    </div>
  );
};

export default ClinicSearchBar;
