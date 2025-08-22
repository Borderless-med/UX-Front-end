import { Button } from '@/components/ui/button';
import { Monitor } from 'lucide-react';

interface SidebarPresetsProps {
  currentWidth: number;
  presetSizes: { label: string; width: number }[];
  onPresetSelect: (preset: 'narrow' | 'default' | 'wide') => void;
}

const SidebarPresets = ({ currentWidth, presetSizes, onPresetSelect }: SidebarPresetsProps) => {
  const getCurrentPreset = () => {
    const closest = presetSizes.reduce((prev, curr) => 
      Math.abs(curr.width - currentWidth) < Math.abs(prev.width - currentWidth) ? curr : prev
    );
    return closest.label.toLowerCase() as 'narrow' | 'default' | 'wide';
  };

  const currentPreset = getCurrentPreset();

  return (
    <div className="hidden lg:flex items-center gap-1 px-2 py-2 bg-muted/30 rounded-lg">
      <Monitor className="h-3 w-3 text-muted-foreground mr-1" />
      <span className="text-xs text-muted-foreground mr-2">Width:</span>
      {presetSizes.map((preset) => {
        const presetKey = preset.label.toLowerCase() as 'narrow' | 'default' | 'wide';
        const isActive = currentPreset === presetKey;
        
        return (
          <Button
            key={preset.label}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={`h-6 px-2 text-xs ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => onPresetSelect(presetKey)}
          >
            {preset.label}
          </Button>
        );
      })}
      <span className="text-xs text-muted-foreground ml-1">({currentWidth}px)</span>
    </div>
  );
};

export default SidebarPresets;