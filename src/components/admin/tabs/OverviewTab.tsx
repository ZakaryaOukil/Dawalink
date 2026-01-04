import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Building2,
  Truck,
  Package,
  ShoppingCart,
  Users,
  FileCheck,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Stats {
  totalPharmacies: number;
  activePharmacies: number;
  totalSuppliers: number;
  activeSuppliers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalAgents: number;
  pendingDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  averageRating: number;
  totalReviews: number;
}

export function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        pharmaciesResult,
        suppliersResult,
        productsResult,
        ordersResult,
        agentsResult,
        documentsResult,
        reviewsResult
      ] = await Promise.all([
        supabase.from('pharmacies').select('id, is_verified'),
        supabase.from('suppliers').select('id, is_verified, average_rating'),
        supabase.from('products').select('id'),
        supabase.from('orders').select('id, status'),
        supabase.from('commercial_agents').select('id'),
        supabase.from('documents').select('id, status'),
        supabase.from('reviews').select('id, rating')
      ]);

      const pharmacies = pharmaciesResult.data || [];
      const suppliers = suppliersResult.data || [];
      const products = productsResult.data || [];
      const orders = ordersResult.data || [];
      const agents = agentsResult.data || [];
      const documents = documentsResult.data || [];
      const reviews = reviewsResult.data || [];

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        totalPharmacies: pharmacies.length,
        activePharmacies: pharmacies.filter(p => p.is_verified).length,
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter(s => s.is_verified).length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        totalAgents: agents.length,
        pendingDocuments: documents.filter(d => d.status === 'pending').length,
        approvedDocuments: documents.filter(d => d.status === 'approved').length,
        rejectedDocuments: documents.filter(d => d.status === 'rejected').length,
        averageRating: avgRating,
        totalReviews: reviews.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [ordersRes, docsRes] = await Promise.all([
        supabase
          .from('orders')
          .select(`
            id, status, total_price, created_at,
            pharmacies(pharmacy_name),
            suppliers(company_name),
            products(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('documents')
          .select('id, document_type, file_name, status, uploaded_at, user_id')
          .order('uploaded_at', { ascending: false })
          .limit(5)
      ]);

      setRecentOrders(ordersRes.data || []);
      setRecentDocuments(docsRes.data || []);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Pharmacies',
      value: stats?.totalPharmacies || 0,
      subValue: `${stats?.activePharmacies || 0} verifiees`,
      icon: Building2,
      color: 'bg-blue-500',
      trend: stats?.activePharmacies && stats.totalPharmacies ?
        Math.round((stats.activePharmacies / stats.totalPharmacies) * 100) : 0
    },
    {
      title: 'Fournisseurs',
      value: stats?.totalSuppliers || 0,
      subValue: `${stats?.activeSuppliers || 0} verifies`,
      icon: Truck,
      color: 'bg-emerald-500',
      trend: stats?.activeSuppliers && stats.totalSuppliers ?
        Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100) : 0
    },
    {
      title: 'Produits',
      value: stats?.totalProducts || 0,
      subValue: 'produits enregistres',
      icon: Package,
      color: 'bg-amber-500'
    },
    {
      title: 'Commandes',
      value: stats?.totalOrders || 0,
      subValue: `${stats?.pendingOrders || 0} en attente`,
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      title: 'Agents Commerciaux',
      value: stats?.totalAgents || 0,
      subValue: 'agents actifs',
      icon: Users,
      color: 'bg-pink-500'
    },
    {
      title: 'Documents',
      value: stats?.pendingDocuments || 0,
      subValue: 'en attente de verification',
      icon: FileCheck,
      color: 'bg-orange-500',
      alert: (stats?.pendingDocuments || 0) > 0
    },
    {
      title: 'Note Moyenne',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      subValue: `${stats?.totalReviews || 0} evaluations`,
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Livraisons',
      value: stats?.deliveredOrders || 0,
      subValue: 'commandes livrees',
      icon: CheckCircle,
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.subValue}</p>
                  </div>
                  <div className={`${stat.color} p-2.5 rounded-xl`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                {stat.alert && (
                  <div className="mt-3 flex items-center gap-1.5 text-orange-600 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Necessite attention</span>
                  </div>
                )}
                {stat.trend !== undefined && (
                  <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{stat.trend}% verifies</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-teal-600" />
              Commandes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">
                Aucune commande pour le moment
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {order.products?.name || 'Produit'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.pharmacies?.pharmacy_name} → {order.suppliers?.company_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">
                        {order.total_price} DH
                      </p>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'}
                      `}>
                        {order.status === 'delivered' ? 'Livre' :
                         order.status === 'pending' ? 'En attente' :
                         order.status === 'shipped' ? 'Expedie' :
                         order.status === 'confirmed' ? 'Confirme' : 'Annule'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              Documents Recents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentDocuments.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">
                Aucun document pour le moment
              </p>
            ) : (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {doc.document_type}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {doc.file_name}
                      </p>
                    </div>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full flex items-center gap-1
                      ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        doc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'}
                    `}>
                      {doc.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                       doc.status === 'pending' ? <Clock className="w-3 h-3" /> :
                       <AlertCircle className="w-3 h-3" />}
                      {doc.status === 'approved' ? 'Approuve' :
                       doc.status === 'pending' ? 'En attente' : 'Rejete'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
