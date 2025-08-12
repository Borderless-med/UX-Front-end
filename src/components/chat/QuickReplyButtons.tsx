import { QuickReplyButton } from '@/types/chat';

interface QuickReplyButtonsProps {
  buttons: QuickReplyButton[];
  onButtonClick: (action: string) => void;
  disabled?: boolean;
}

const QuickReplyButtons = ({ buttons, onButtonClick, disabled = false }: QuickReplyButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => onButtonClick(button.action)}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-blue-primary hover:text-blue-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};

export default QuickReplyButtons;