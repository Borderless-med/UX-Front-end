
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IframeAwareDialog from './IframeAwareDialog';
import LoginForm from './LoginForm';
import PDPARegistrationForm from './PDPARegistrationForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSuccess = () => {
    onClose();
    // --- FINAL FIX: Escape the iframe and reload ---
    window.top.location.href = window.top.location.href;
  };
  return (
    <IframeAwareDialog isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Authentication</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account or create a new account to access practitioner details
          </p>
        </div>
        
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
      </div>
    </IframeAwareDialog>
  );
};

export default AuthModal;
