import { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  reference: string;
  category: string;
  price: number;
  stock: number;
  available: boolean;
}

interface ImportExcelModalProps {
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

export function ImportExcelModal({ onClose, onImport }: ImportExcelModalProps) {
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = () => {
    setFileUploaded(true);
    // Simulate Excel import with mock data
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: Date.now().toString(),
          name: 'Aspirine 100mg',
          reference: 'MED-010',
          category: 'Antalgique',
          price: 15.50,
          stock: 1000,
          available: true
        },
        {
          id: (Date.now() + 1).toString(),
          name: 'Doliprane 1000mg',
          reference: 'MED-011',
          category: 'Antalgique',
          price: 45.00,
          stock: 500,
          available: true
        },
      ];
      onImport(mockProducts);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Importer depuis Excel</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!fileUploaded ? (
            <>
              <div className="mb-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 mb-2">
                      Téléchargez d'abord notre modèle Excel pour assurer la compatibilité
                    </p>
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                      <Download className="w-4 h-4" />
                      Télécharger le modèle
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="mb-2 text-gray-900">
                  Glissez-déposez votre fichier Excel ici
                </p>
                <p className="text-sm text-gray-600 mb-4">ou</p>
                <button
                  onClick={handleFileUpload}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Parcourir les fichiers
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Formats acceptés: .xlsx, .xls (Max 10MB)
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-900 mb-2">
                Importation en cours...
              </p>
              <p className="text-sm text-gray-600">
                Vos produits sont en cours d'importation
              </p>
            </div>
          )}

          {!fileUploaded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="mb-3 text-gray-900">Instructions:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-600">1.</span>
                  <span>Téléchargez le modèle Excel fourni</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">2.</span>
                  <span>Remplissez les colonnes: Nom, Référence, Catégorie, Prix, Stock, Disponible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">3.</span>
                  <span>Sauvegardez et importez le fichier</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
