import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, style, ...props }, ref) => {
  console.log('🔍 TooltipContent mounting with props:', { className, sideOffset, style, props });
  
  React.useEffect(() => {
    console.log('🔍 TooltipContent mounted');
    
    // Check actual DOM structure after mount
    setTimeout(() => {
      const tooltipElements = document.querySelectorAll('[data-radix-tooltip-content]');
      console.log('🔍 Found tooltip elements in DOM:', tooltipElements);
      tooltipElements.forEach((el, index) => {
        console.log(`🔍 Tooltip ${index}:`, {
          element: el,
          attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`),
          computedStyle: window.getComputedStyle(el),
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          zIndex: window.getComputedStyle(el).zIndex
        });
      });
      
      // Check CSS variables
      const rootStyle = getComputedStyle(document.documentElement);
      console.log('🔍 CSS Variables:', {
        popover: rootStyle.getPropertyValue('--popover'),
        popoverForeground: rootStyle.getPropertyValue('--popover-foreground'),
        border: rootStyle.getPropertyValue('--border')
      });
    }, 100);
  }, []);
  
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[9999] overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground tooltip-content",
        className
      )}
      style={{
        backgroundColor: 'white',
        color: 'black', 
        borderColor: 'hsl(var(--border))',
        zIndex: 9999,
        ...style
      }}
      {...props}
    />
  );
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
