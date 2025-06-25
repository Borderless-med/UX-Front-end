
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWithTextProps {
  icon: LucideIcon;
  text: string;
  iconClassName?: string;
  textClassName?: string;
  className?: string;
}

const IconWithText: React.FC<IconWithTextProps> = ({
  icon: Icon,
  text,
  iconClassName = "h-4 w-4",
  textClassName = "",
  className = "flex items-center gap-2",
}) => {
  return (
    <div className={className}>
      <Icon className={iconClassName} />
      <span className={textClassName}>{text}</span>
    </div>
  );
};

export default IconWithText;
