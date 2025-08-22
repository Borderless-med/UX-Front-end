import { useState, useCallback, useEffect } from 'react';

interface UseSidebarResizeReturn {
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  presetSizes: { label: string; width: number }[];
  setPresetSize: (preset: 'narrow' | 'default' | 'wide') => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
}

export const useSidebarResize = (): UseSidebarResizeReturn => {
  // Use clamp values that scale better with zoom
  const [sidebarWidth, setSidebarWidthState] = useState(400); // Reduced default for better zoom scaling
  const [isResizing, setIsResizing] = useState(false);

  const presetSizes = [
    { label: 'Narrow', width: 320 },
    { label: 'Default', width: 400 },
    { label: 'Wide', width: 480 }
  ];

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('clinic-sidebar-width');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= 320 && width <= 800) {
        setSidebarWidthState(width);
      }
    }
  }, []);

  const setSidebarWidth = useCallback((width: number) => {
    // Tighter constraints for better zoom scaling
    const clampedWidth = Math.max(280, Math.min(600, width));
    setSidebarWidthState(clampedWidth);
    localStorage.setItem('clinic-sidebar-width', clampedWidth.toString());
  }, []);

  const setPresetSize = useCallback((preset: 'narrow' | 'default' | 'wide') => {
    const presetWidth = presetSizes.find(p => p.label.toLowerCase() === preset)?.width || 400;
    setSidebarWidth(presetWidth);
  }, [setSidebarWidth, presetSizes]);

  return {
    sidebarWidth,
    setSidebarWidth,
    presetSizes,
    setPresetSize,
    isResizing,
    setIsResizing
  };
};