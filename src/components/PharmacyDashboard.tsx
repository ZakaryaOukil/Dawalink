import { useState } from 'react';
import { Package, Search, LogOut } from 'lucide-react';
import { ProductSearch } from './pharmacy/ProductSearch';
import { ProductDetailModal } from './pharmacy/ProductDetailModal';

interface PharmacyDashboardProps {
  onLogout: () => void;
}

export interface Product {
  id: string;
  name: string;
  reference: string;
  category: string;
  price: number;
  supplier: string;
  supplierRating: number;
  available: boolean;
}

export function PharmacyDashboard({ onLogout }: PharmacyDashboardProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sky-700">DawaLink</h1>
                <p className="text-sm text-gray-600">Pharmacie Centrale</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-8 h-8" />
            <h2>Trouvez vos médicaments</h2>
          </div>
          <p className="text-sky-100 max-w-2xl mx-auto">
            Recherchez parmi des milliers de produits pharmaceutiques et contactez 
            directement les agents commerciaux
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductSearch onProductSelect={setSelectedProduct} />
      </main>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}