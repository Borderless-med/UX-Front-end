import { useState, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  currentWidth: number;
}

const ResizeHandle = ({ onResize, onResizeStart, onResizeEnd, currentWidth }: ResizeHandleProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    onResizeStart();
    
    const startX = e.clientX;
    const startWidth = currentWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onResizeEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [currentWidth, onResize, onResizeStart, onResizeEnd]);

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <div
      className={`
        hidden lg:flex w-1 bg-border hover:bg-primary/20 cursor-col-resize 
        items-center justify-center group transition-colors duration-200 relative z-10
        ${isDragging ? 'bg-primary/30' : ''}
      `}
      onMouseDown={handleMouseDown}
      title="Drag to resize sidebar"
    >
      <div className={`
        absolute inset-y-0 left-0 right-0 flex items-center justify-center
        ${isDragging ? 'bg-primary/10' : 'group-hover:bg-primary/10'}
      `}>
        <GripVertical 
          className={`
            h-4 w-4 text-muted-foreground transition-colors duration-200 pointer-events-none
            ${isDragging ? 'text-primary' : 'group-hover:text-primary'}
          `} 
        />
      </div>
    </div>
  );
};

export default ResizeHandle;