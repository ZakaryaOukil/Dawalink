import { useState } from 'react';
import { ProfessionalLandingPage } from './components/ProfessionalLandingPage';
import { SupplierDashboard } from './components/SupplierDashboard';
import { PharmacyDashboard } from './components/PharmacyDashboard';
import { RegistrationFlow } from './components/RegistrationFlow';

export type UserType = 'supplier' | 'pharmacy' | null;
export type AuthState = 'landing' | 'registration' | 'dashboard';

function App() {
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [userType, setUserType] = useState<UserType>(null);

  const handleGetStarted = (type: UserType) => {
    setUserType(type);
    setAuthState('registration');
  };

  const handleRegistrationComplete = () => {
    setAuthState('dashboard');
  };

  const handleLogout = () => {
    setAuthState('landing');
    setUserType(null);
  };

  return (
    <div className="min-h-screen">
      {authState === 'landing' && (
        <ProfessionalLandingPage onGetStarted={handleGetStarted} />
      )}
      
      {authState === 'registration' && userType && (
        <RegistrationFlow 
          userType={userType} 
          onComplete={handleRegistrationComplete}
          onBack={() => setAuthState('landing')}
        />
      )}
      
      {authState === 'dashboard' && userType === 'supplier' && (
        <SupplierDashboard onLogout={handleLogout} />
      )}
      
      {authState === 'dashboard' && userType === 'pharmacy' && (
        <PharmacyDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;