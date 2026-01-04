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
  Menu,
  X,
  TrendingUp,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
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
  { id: 'agents', label: 'Agents Commerciaux', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileCheck },
  { id: 'ratings', label: 'Evaluations', icon: Star },
] as const;

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
        bg-gradient-to-b from-slate-800 to-slate-900 text-white
        transition-all duration-300 ease-in-out
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">DawaLink</h1>
                <p className="text-xs text-slate-400">Administration</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white hover:bg-slate-700 hidden lg:flex"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{tab.label}</span>}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-slate-700">
          {sidebarOpen && adminInfo && (
            <div className="mb-3 px-3 py-2 bg-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-400">Connecte en tant que</p>
              <p className="text-sm font-medium text-white">{adminInfo.username}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-red-600/20
              ${sidebarOpen ? 'justify-start px-3' : 'justify-center'}
            `}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Deconnexion</span>}
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-slate-500">
                  Gestion et surveillance de la plateforme
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
