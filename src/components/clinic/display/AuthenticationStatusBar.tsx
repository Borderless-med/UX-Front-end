import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, LogOut, Shield, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { categoryLabels } from '../utils/clinicConstants';

interface AuthenticationStatusBarProps {
  onSignInClick: () => void;
}

const AuthenticationStatusBar: React.FC<AuthenticationStatusBarProps> = ({ onSignInClick }) => {
  const { user, isAuthenticated, userProfile, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  Enhanced Clinic Information Available
                </h3>
                <p className="text-sm text-blue-700">
                  Sign in to view dentist names, MDA licenses, detailed practitioner information, chat history, and past transactions
                </p>
              </div>
            </div>
            <Button 
              onClick={onSignInClick}
              className="bg-blue-primary hover:bg-blue-primary/90 text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">
                Full Access Enabled
              </h3>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span>Welcome back, {user?.email}</span>
                {userProfile && (
                  <span className="px-2 py-1 bg-green-100 rounded-full text-xs">
                    {categoryLabels[userProfile.user_category]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:text-green-900 hover:bg-green-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AuthenticationStatusBar;