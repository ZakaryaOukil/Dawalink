import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import {
  Search,
  Loader2,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  pharmacies: {
    pharmacy_name: string;
  } | null;
  suppliers: {
    company_name: string;
  } | null;
  products: {
    name: string;
  } | null;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  pending: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  confirmed: { label: 'Confirme', bg: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle },
  shipped: { label: 'Expedie', bg: 'bg-teal-50', text: 'text-teal-700', icon: Truck },
  delivered: { label: 'Livre', bg: 'bg-green-50', text: 'text-green-700', icon: Package },
  cancelled: { label: 'Annule', bg: 'bg-red-50', text: 'text-red-700', icon: XCircle }
};

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          pharmacies(pharmacy_name),
          suppliers(company_name),
          products(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setOrders(prev => prev.map(o =>
        o.id === id ? { ...o, status: newStatus } : o
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.pharmacies?.pharmacy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.suppliers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total_price, 0)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2.5 rounded-xl">
                <ShoppingCart className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-sm text-slate-500">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                <p className="text-sm text-slate-500">Livrees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-teal-600">{stats.totalRevenue.toLocaleString()} DH</p>
                <p className="text-sm text-slate-500">Chiffre d'affaires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Historique des Commandes
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64 bg-slate-50 border-0"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-50 border-0">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirme</SelectItem>
                  <SelectItem value="shipped">Expedie</SelectItem>
                  <SelectItem value="delivered">Livre</SelectItem>
                  <SelectItem value="cancelled">Annule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucune commande trouvee</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const Icon = config.icon;
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-slate-800 truncate">
                            {order.products?.name || 'Produit'}
                          </p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span>{order.pharmacies?.pharmacy_name || '-'}</span>
                          <span className="text-slate-300">|</span>
                          <span>{order.suppliers?.company_name || '-'}</span>
                          <span className="text-slate-300 hidden sm:inline">|</span>
                          <span className="hidden sm:inline">Qte: {order.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right hidden md:block">
                        <p className="font-semibold text-slate-800">{order.total_price.toLocaleString()} DH</p>
                        <p className="text-xs text-slate-400">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs bg-slate-50 border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirme</SelectItem>
                          <SelectItem value="shipped">Expedie</SelectItem>
                          <SelectItem value="delivered">Livre</SelectItem>
                          <SelectItem value="cancelled">Annule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
