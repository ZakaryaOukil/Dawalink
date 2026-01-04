import { useState } from 'react';
import { Package, Users, BarChart3, LogOut, Plus } from 'lucide-react';
import { ProductsTab } from './supplier/ProductsTab';
import { AgentsTab } from './supplier/AgentsTab';
import { AnalyticsTab } from './supplier/AnalyticsTab';

interface SupplierDashboardProps {
  onLogout: () => void;
}

type TabType = 'products' | 'agents' | 'analytics';

export function SupplierDashboard({ onLogout }: SupplierDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-teal-700">DawaLink</h1>
                <p className="text-sm text-gray-600">Pharma Distribution SA</p>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              Produits
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'agents'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              Agents Commerciaux
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Statistiques
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'agents' && <AgentsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  );
}