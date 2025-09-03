import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationAuthButtonProps {
  onAuthClick: () => void;
}

const NavigationAuthButton = ({ onAuthClick }: NavigationAuthButtonProps) => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onAuthClick}
            variant="outline"
            className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Sign In / Sign Up
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Access your account or create a new one</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-blue-primary/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-primary text-white text-xs">
                  {getInitials(user.email || '')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-blue-dark">
                {getDisplayName()}
              </span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>View profile and account options</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Manage your profile settings</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuItem 
              onClick={logout}
              className="flex items-center cursor-pointer text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Sign out of your account</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationAuthButton;