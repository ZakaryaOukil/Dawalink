import { useState, useEffect } from 'react';
import { ProfessionalLandingPage } from './components/ProfessionalLandingPage';
import { SupplierDashboard } from './components/SupplierDashboard';
import { PharmacyDashboard } from './components/PharmacyDashboard';
import { RegistrationFlow } from './components/RegistrationFlow';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export type UserType = 'supplier' | 'pharmacy' | null;
export type AuthState = 'landing' | 'registration' | 'dashboard';

function App() {
  const { user, userType: authUserType, isLoading, signOut } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);

  useEffect(() => {
    if (!isLoading) {
      if (user && authUserType) {
        setAuthState('dashboard');
        setSelectedUserType(authUserType);
      } else if (!user) {
        setAuthState('landing');
        setSelectedUserType(null);
      }
    }
  }, [user, authUserType, isLoading]);

  const handleGetStarted = (type: UserType) => {
    setSelectedUserType(type);
    setAuthState('registration');
  };

  const handleRegistrationComplete = () => {
    setAuthState('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setAuthState('landing');
    setSelectedUserType(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {authState === 'landing' && (
        <ProfessionalLandingPage onGetStarted={handleGetStarted} />
      )}

      {authState === 'registration' && selectedUserType && (
        <RegistrationFlow
          userType={selectedUserType}
          onComplete={handleRegistrationComplete}
          onBack={() => setAuthState('landing')}
        />
      )}

      {authState === 'dashboard' && (selectedUserType === 'supplier' || authUserType === 'supplier') && (
        <SupplierDashboard onLogout={handleLogout} />
      )}

      {authState === 'dashboard' && (selectedUserType === 'pharmacy' || authUserType === 'pharmacy') && (
        <PharmacyDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
