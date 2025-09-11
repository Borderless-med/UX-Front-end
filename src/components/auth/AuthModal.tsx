
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import PDPARegistrationForm from './PDPARegistrationForm';
import LovableAuthNotice from './LovableAuthNotice';
import { shouldUseIframeWorkaround } from '@/utils/environment';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSuccess = () => {
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Check if we should show the iframe workaround
  const useWorkaround = shouldUseIframeWorkaround();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto z-[99999]" aria-describedby="auth-modal-description">
        <DialogHeader>
          <DialogTitle id="auth-modal-title">Authentication</DialogTitle>
          <DialogDescription id="auth-modal-description">
            {useWorkaround 
              ? "Please use the production environment for authentication"
              : "Sign in to your account or create a new account to access practitioner details"
            }
          </DialogDescription>
        </DialogHeader>
        
        {useWorkaround ? (
          <LovableAuthNotice onClose={onClose} />
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                onSuccess={handleSuccess}
                onSwitchToRegister={() => setActiveTab('register')}
              />
            </TabsContent>
            
            <TabsContent value="register">
              <PDPARegistrationForm 
                onSuccess={handleSuccess}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
