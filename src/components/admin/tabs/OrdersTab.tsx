import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../ui/table';
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
  DollarSign,
  TrendingUp
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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  confirmed: { label: 'Confirme', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  shipped: { label: 'Expedie', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Livre', color: 'bg-emerald-100 text-emerald-700', icon: Package },
  cancelled: { label: 'Annule', color: 'bg-red-100 text-red-700', icon: XCircle }
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
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-xl">
                <ShoppingCart className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">En attente</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Confirmes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expedies</p>
                <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Livres</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.delivered}</p>
              </div>
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">CA Total</p>
                <p className="text-xl font-bold text-teal-600">{stats.totalRevenue.toLocaleString()} DH</p>
              </div>
              <div className="bg-teal-100 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Historique des Commandes
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
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
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune commande trouvee</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Pharmacie</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Quantite</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    const Icon = config.icon;
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.products?.name || '-'}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {order.pharmacies?.pharmacy_name || '-'}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {order.suppliers?.company_name || '-'}
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-medium">
                          {order.total_price.toLocaleString()} DH
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge className={config.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
