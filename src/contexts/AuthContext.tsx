import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Supplier, Pharmacy } from '../lib/database.types';

type UserType = 'supplier' | 'pharmacy' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: UserType;
  profile: Supplier | Pharmacy | null;
  isLoading: boolean;
  isVerified: boolean;
  signUp: (
    email: string,
    password: string,
    type: 'supplier' | 'pharmacy',
    profileData: Record<string, string>
  ) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [profile, setProfile] = useState<Supplier | Pharmacy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    const { data: supplierData } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (supplierData) {
      setUserType('supplier');
      setProfile(supplierData);
      setIsVerified(supplierData.is_verified);
      return;
    }

    const { data: pharmacyData } = await supabase
      .from('pharmacies')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (pharmacyData) {
      setUserType('pharmacy');
      setProfile(pharmacyData);
      setIsVerified(pharmacyData.is_verified);
      return;
    }

    setUserType(null);
    setProfile(null);
    setIsVerified(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        (async () => {
          await fetchUserProfile(newSession.user.id);
        })();
      } else {
        setUserType(null);
        setProfile(null);
        setIsVerified(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    type: 'supplier' | 'pharmacy',
    profileData: Record<string, string>
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      if (type === 'supplier') {
        const { error: profileError } = await supabase.from('suppliers').insert({
          id: data.user.id,
          company_name: profileData.companyName,
          registry_number: profileData.registryNumber,
          phone: profileData.phone,
          address: profileData.address,
          email: email,
        });

        if (profileError) return { error: profileError };
      } else {
        const { error: profileError } = await supabase.from('pharmacies').insert({
          id: data.user.id,
          pharmacy_name: profileData.pharmacyName,
          license_number: profileData.licenseNumber,
          phone: profileData.phone,
          address: profileData.address,
          email: email,
        });

        if (profileError) return { error: profileError };
      }
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserType(null);
    setProfile(null);
    setIsVerified(false);
  };

  const value = {
    user,
    session,
    userType,
    profile,
    isLoading,
    isVerified,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
