import { Bot } from 'lucide-react';
import React from 'react';

interface AIIconProps {
  size?: number; // pixel size for both width and height
  className?: string;
  colorClassName?: string; // tailwind color class for icon stroke/fill
}

const AIIcon: React.FC<AIIconProps> = ({ size = 24, className = '', colorClassName = 'text-blue-600' }) => {
  return <Bot className={`${colorClassName} ${className}`} style={{ width: size, height: size }} />;
};

export default AIIcon;
