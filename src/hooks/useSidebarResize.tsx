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
  const [sidebarWidth, setSidebarWidthState] = useState(480); // Default reduced from 600px
  const [isResizing, setIsResizing] = useState(false);

  const presetSizes = [
    { label: 'Narrow', width: 400 },
    { label: 'Default', width: 480 },
    { label: 'Wide', width: 600 }
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
    const clampedWidth = Math.max(320, Math.min(800, width));
    setSidebarWidthState(clampedWidth);
    localStorage.setItem('clinic-sidebar-width', clampedWidth.toString());
  }, []);

  const setPresetSize = useCallback((preset: 'narrow' | 'default' | 'wide') => {
    const presetWidth = presetSizes.find(p => p.label.toLowerCase() === preset)?.width || 480;
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