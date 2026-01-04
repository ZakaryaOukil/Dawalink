import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, Clock } from 'lucide-react';
import { UserType } from '../App';

interface RegistrationFlowProps {
  userType: UserType;
  onComplete: () => void;
  onBack: () => void;
}

export function RegistrationFlow({ userType, onComplete, onBack }: RegistrationFlowProps) {
  const [step, setStep] = useState<'form' | 'documents' | 'pending'>('form');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const handleFileUpload = (docType: string) => {
    if (!uploadedDocs.includes(docType)) {
      setUploadedDocs([...uploadedDocs, docType]);
    }
  };

  const requiredDocs = userType === 'supplier' 
    ? ['Registre de commerce', 'Autorisation d\'exploitation', 'Certificat fiscal']
    : ['Licence de pharmacie', 'Pièce d\'identité', 'Certificat d\'inscription'];

  const canProceed = uploadedDocs.length === requiredDocs.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Progress Steps */}
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

        {/* Form Step */}
        {step === 'form' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="mb-6">
              Inscription {userType === 'supplier' ? 'Fournisseur' : 'Pharmacie'}
            </h2>
            <form className="space-y-6">
              {userType === 'supplier' ? (
                <>
                  <div>
                    <label className="block mb-2 text-gray-700">Nom de l'entreprise</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Pharma Distribution SA"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Numéro de registre</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Pharmacie Centrale"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Numéro de licence</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="PH789012"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@exemple.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+213 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Adresse</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Adresse complète"
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('documents')}
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Continuer
              </button>
            </form>
          </div>
        )}

        {/* Documents Step */}
        {step === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="mb-6">
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
                      {uploadedDocs.includes(doc) ? 'Modifié' : 'Télécharger'}
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
                onClick={() => setStep('pending')}
                disabled={!canProceed}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  canProceed
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Soumettre
              </button>
            </div>
          </div>
        )}

        {/* Pending Step */}
        {step === 'pending' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="mb-4">
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
              Accéder au tableau de bord (Demo)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}