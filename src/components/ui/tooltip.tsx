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
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[9999] overflow-hidden rounded-md border border-gray-300 bg-white text-black px-3 py-1.5 text-sm shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
