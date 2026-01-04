import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Truck,
  Package,
  Users,
  FileCheck,
  Star,
  LogOut,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../ui/button';
import { OverviewTab } from './tabs/OverviewTab';
import { PharmaciesTab } from './tabs/PharmaciesTab';
import { SuppliersTab } from './tabs/SuppliersTab';
import { ProductsTab } from './tabs/ProductsTab';
import { OrdersTab } from './tabs/OrdersTab';
import { AgentsTab } from './tabs/AgentsTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { RatingsTab } from './tabs/RatingsTab';

type TabType = 'overview' | 'pharmacies' | 'suppliers' | 'products' | 'orders' | 'agents' | 'documents' | 'ratings';

interface AdminDashboardProps {
  onLogout: () => void;
}

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'pharmacies', label: 'Pharmacies', icon: Building2 },
  { id: 'suppliers', label: 'Fournisseurs', icon: Truck },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileCheck },
  { id: 'ratings', label: 'Evaluations', icon: Star },
] as const;

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [adminInfo, setAdminInfo] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      setAdminInfo(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    onLogout();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'pharmacies':
        return <PharmaciesTab />;
      case 'suppliers':
        return <SuppliersTab />;
      case 'products':
        return <ProductsTab />;
      case 'orders':
        return <OrdersTab />;
      case 'agents':
        return <AgentsTab />;
      case 'documents':
        return <DocumentsTab />;
      case 'ratings':
        return <RatingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-lg">DawaLink</h1>
                <p className="text-xs text-slate-500">Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {adminInfo && (
                <div className="px-4 py-2 bg-slate-50 rounded-lg hidden sm:block">
                  <p className="text-xs text-slate-500">Connecte en tant que</p>
                  <p className="text-sm font-semibold text-slate-800">{adminInfo.username}</p>
                </div>
              )}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-teal-700">En ligne</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Deconnexion</span>
              </Button>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
                    transition-all duration-200
                    ${isActive
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="min-h-screen">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
