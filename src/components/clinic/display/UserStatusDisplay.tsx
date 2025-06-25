
import { Button } from '@/components/ui/button';
import { categoryLabels } from '../utils/clinicConstants';

interface UserStatusDisplayProps {
  isAuthenticated: boolean;
  userProfile: any;
  onSignInClick: () => void;
}

const UserStatusDisplay = ({ isAuthenticated, userProfile, onSignInClick }: UserStatusDisplayProps) => {
  if (!isAuthenticated) {
    return (
      <div className="text-sm text-blue-600">
        Sign in to view detailed clinic information{' '}
        <Button 
          onClick={onSignInClick}
          variant="outline" 
          size="sm" 
          className="ml-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="text-sm">
      <span className="text-green-600">✓ Signed in</span>
      {userProfile && (
        <span className="text-blue-600 ml-2">
          ({categoryLabels[userProfile.user_category]} - Full details available)
        </span>
      )}
    </div>
  );
};

export default UserStatusDisplay;
