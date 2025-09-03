
interface PractitionerDetailsProps {
  clinic: any;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewDetails: (clinic: any) => void;
}

const PractitionerDetails = ({ 
  clinic, 
  isAuthenticated, 
  onSignInClick, 
  onViewDetails 
}: PractitionerDetailsProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-blue-light/30">
      {isAuthenticated ? (
        <div onClick={() => onViewDetails(clinic)}>
          <p className="text-xs text-neutral-gray mb-1">Dentist: {clinic.dentist}</p>
          <p className="text-xs text-neutral-gray">MDA License: {clinic.mdaLicense}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-blue-600 mb-1">
            Dentist: Dr. {clinic.dentist ? clinic.dentist.charAt(0) + '***' : 'S***'} - 
            <button 
              onClick={onSignInClick}
              className="ml-1 underline hover:text-blue-dark"
            >
              Sign in for full details
            </button>
          </p>
          <p className="text-xs text-blue-600">
            MDA License: {clinic.mdaLicense ? clinic.mdaLicense.substring(0, 2) + '***' : 'MD***'} - 
            <button 
              onClick={onSignInClick}
              className="ml-1 underline hover:text-blue-dark"
            >
              Sign in for full details
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default PractitionerDetails;
