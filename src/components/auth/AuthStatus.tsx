
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface AuthStatusProps {
  onLoginClick: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ onLoginClick }) => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-gray">
          Sign in to view detailed clinic information
        </span>
        <Button 
          onClick={onLoginClick}
          variant="outline" 
          size="sm"
          className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
        >
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-blue-primary" />
        <span className="text-sm text-blue-dark">
          Welcome, {user?.email}
        </span>
      </div>
      <Button 
        onClick={logout}
        variant="ghost" 
        size="sm"
        className="text-neutral-gray hover:text-blue-primary"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default AuthStatus;
