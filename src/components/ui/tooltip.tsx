import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ children, ...props }, ref) => {
  console.log('🔍 TooltipTrigger rendered with props:', props);
  
  React.useEffect(() => {
    console.log('🔍 TooltipTrigger mounted');
  }, []);

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      onMouseEnter={(e) => {
        console.log('🔍 TooltipTrigger onMouseEnter');
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        console.log('🔍 TooltipTrigger onMouseLeave');
        props.onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        console.log('🔍 TooltipTrigger onFocus');
        props.onFocus?.(e);
      }}
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, style, ...props }, ref) => {
  console.log('🔧 FINAL FIX: TooltipContent rendering');
  
  React.useEffect(() => {
    console.log('🔧 TooltipContent mounted, checking DOM in 100ms...');
    setTimeout(() => {
      const tooltips = document.querySelectorAll('[data-radix-tooltip-content]');
      tooltips.forEach((tooltip, i) => {
        console.log(`🔧 Tooltip ${i} computed styles:`, {
          backgroundColor: getComputedStyle(tooltip).backgroundColor,
          color: getComputedStyle(tooltip).color,
          opacity: getComputedStyle(tooltip).opacity,
          visibility: getComputedStyle(tooltip).visibility
        });
      });
    }, 100);
  }, []);

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "!z-[9999] !overflow-hidden !rounded-md !border !border-gray-300 !bg-white !text-black !px-3 !py-1.5 !text-sm !shadow-lg !opacity-100 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        borderColor: '#d1d5db',
        opacity: 1,
        visibility: 'visible' as const,
        zIndex: 9999,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ...style
      }}
      {...props}
    />
  );
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }