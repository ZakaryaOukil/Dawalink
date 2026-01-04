import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { UserType } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface RegistrationFlowProps {
  userType: UserType;
  onComplete: () => void;
  onBack: () => void;
}

export function RegistrationFlow({ userType, onComplete, onBack }: RegistrationFlowProps) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [step, setStep] = useState<'form' | 'documents' | 'pending'>('form');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    registryNumber: '',
    pharmacyName: '',
    licenseNumber: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn(loginData.email, loginData.password);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else {
          setError(signInError.message);
        }
        return;
      }

      onComplete();
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (docType: string) => {
    if (!uploadedDocs.includes(docType)) {
      setUploadedDocs([...uploadedDocs, docType]);
    }
  };

  const requiredDocs = userType === 'supplier'
    ? ['Registre de commerce', 'Autorisation d\'exploitation', 'Certificat fiscal']
    : ['Licence de pharmacie', 'Pièce d\'identité', 'Certificat d\'inscription'];

  const canProceed = uploadedDocs.length === requiredDocs.length;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.phone || !formData.address) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (userType === 'supplier' && (!formData.companyName || !formData.registryNumber)) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (userType === 'pharmacy' && (!formData.pharmacyName || !formData.licenseNumber)) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setStep('documents');
  };

  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const profileData = userType === 'supplier'
        ? {
            companyName: formData.companyName,
            registryNumber: formData.registryNumber,
            phone: formData.phone,
            address: formData.address,
          }
        : {
            pharmacyName: formData.pharmacyName,
            licenseNumber: formData.licenseNumber,
            phone: formData.phone,
            address: formData.address,
          };

      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        userType!,
        profileData
      );

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Cette adresse email est déjà utilisée');
        } else if (signUpError.message.includes('duplicate')) {
          setError('Ce numéro de registre ou licence existe déjà');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const docType of uploadedDocs) {
          await supabase.from('documents').insert({
            user_id: user.id,
            document_type: docType,
            file_name: `${docType}.pdf`,
            status: 'pending',
          });
        }
      }

      setStep('pending');
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {mode === 'signup' && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'form' ? 'text-teal-700' : 'text-teal-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'form' ? 'bg-teal-600 text-white' : 'bg-teal-600 text-white'
                }`}>
                  {step !== 'form' ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span>Informations</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${
                step === 'documents' ? 'text-teal-700' : step === 'pending' ? 'text-teal-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'documents' ? 'bg-teal-600 text-white' :
                  step === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-white'
                }`}>
                  {step === 'pending' ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span>Documents</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step === 'pending' ? 'text-teal-700' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-white'
                }`}>
                  3
                </div>
                <span>Vérification</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {step === 'form' && mode === 'signin' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Connexion {userType === 'supplier' ? 'Fournisseur' : 'Pharmacie'}
            </h2>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="contact@exemple.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        )}

        {step === 'form' && mode === 'signup' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Inscription {userType === 'supplier' ? 'Fournisseur' : 'Pharmacie'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {userType === 'supplier' ? (
                <>
                  <div>
                    <label className="block mb-2 text-gray-700">Nom de l'entreprise</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Pharma Distribution SA"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Numéro de registre</label>
                    <input
                      type="text"
                      value={formData.registryNumber}
                      onChange={(e) => setFormData({ ...formData, registryNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="RC123456"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2 text-gray-700">Nom de la pharmacie</label>
                    <input
                      type="text"
                      value={formData.pharmacyName}
                      onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Pharmacie Centrale"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Numéro de licence</label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="PH789012"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="contact@exemple.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+213 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Adresse</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={3}
                  placeholder="Adresse complète"
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Minimum 6 caractères"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Continuer
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà inscrit ?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        )}

        {step === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Documents de vérification
            </h2>
            <p className="text-gray-600 mb-6">
              Veuillez télécharger les documents suivants pour vérification
            </p>

            <div className="space-y-4 mb-8">
              {requiredDocs.map((doc) => (
                <div key={doc} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {uploadedDocs.includes(doc) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <p className="text-gray-900">{doc}</p>
                        {uploadedDocs.includes(doc) && (
                          <p className="text-sm text-green-600">Document téléchargé</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileUpload(doc)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        uploadedDocs.includes(doc)
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-teal-600 text-white hover:bg-teal-700'
                      }`}
                    >
                      {uploadedDocs.includes(doc) ? 'Modifier' : 'Télécharger'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('form')}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleSubmitRegistration}
                disabled={!canProceed || isSubmitting}
                className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  canProceed && !isSubmitting
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  'Soumettre'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'pending' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Vérification en cours
            </h2>
            <p className="text-gray-600 mb-8">
              Votre inscription a été soumise avec succès. Nos administrateurs examinent
              vos documents. Vous recevrez une notification par email une fois votre compte vérifié.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                La vérification prend généralement 24-48 heures. Pour toute question,
                contactez support@dawalink.com
              </p>
            </div>
            <button
              onClick={onComplete}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Accéder au tableau de bord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
