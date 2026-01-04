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
  ShoppingCart,
  ChevronRight
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
  { id: 'agents', label: 'Agents', icon: Users },
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
    <div className="min-h-screen bg-slate-100">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72
        bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-lg">DawaLink</h1>
                <p className="text-xs text-slate-500">Administration</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 py-6">
            <nav className="px-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl
                      transition-all duration-200 group
                      ${isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-slate-100">
            {adminInfo && (
              <div className="mb-4 px-4 py-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Connecte en tant que</p>
                <p className="text-sm font-semibold text-slate-800">{adminInfo.username}</p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50 px-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Deconnexion</span>
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={`min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : ''}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-slate-500 hidden sm:block">
                  Gestion de la plateforme DawaLink
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-teal-700">En ligne</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
