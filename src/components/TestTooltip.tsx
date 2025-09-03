import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const TestTooltip = () => {
  console.log('🧪 TestTooltip component rendered');
  
  React.useEffect(() => {
    console.log('🧪 TestTooltip mounted');
  }, []);

  const handleTriggerMouseEnter = () => {
    console.log('🧪 Trigger mouse enter');
  };

  const handleTriggerMouseLeave = () => {
    console.log('🧪 Trigger mouse leave');
  };

  return (
    <div className="p-4 border-2 border-red-500 m-4">
      <h3 className="text-lg font-bold mb-4">Test Tooltip (Should be visible in red border)</h3>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline"
              onMouseEnter={handleTriggerMouseEnter}
              onMouseLeave={handleTriggerMouseLeave}
              className="bg-yellow-200 hover:bg-yellow-300"
            >
              Hover me for tooltip
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a test tooltip!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TestTooltip;