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
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
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

  const mainStats = [
    {
      title: 'Pharmacies',
      value: stats?.totalPharmacies || 0,
      subValue: `${stats?.activePharmacies || 0} verifiees`,
      icon: Building2,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: stats?.activePharmacies && stats.totalPharmacies
        ? Math.round((stats.activePharmacies / stats.totalPharmacies) * 100)
        : 0,
      trendUp: true
    },
    {
      title: 'Fournisseurs',
      value: stats?.totalSuppliers || 0,
      subValue: `${stats?.activeSuppliers || 0} verifies`,
      icon: Truck,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      trend: stats?.activeSuppliers && stats.totalSuppliers
        ? Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100)
        : 0,
      trendUp: true
    },
    {
      title: 'Produits',
      value: stats?.totalProducts || 0,
      subValue: 'au catalogue',
      icon: Package,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Commandes',
      value: stats?.totalOrders || 0,
      subValue: `${stats?.pendingOrders || 0} en attente`,
      icon: ShoppingCart,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      alert: (stats?.pendingOrders || 0) > 0
    }
  ];

  const secondaryStats = [
    {
      title: 'Agents',
      value: stats?.totalAgents || 0,
      icon: Users,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    {
      title: 'Documents en attente',
      value: stats?.pendingDocuments || 0,
      icon: FileCheck,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      alert: (stats?.pendingDocuments || 0) > 0
    },
    {
      title: 'Note Moyenne',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      subValue: `${stats?.totalReviews || 0} avis`,
      icon: Star,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Livrees',
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livre';
      case 'pending': return 'En attente';
      case 'shipped': return 'Expedie';
      case 'confirmed': return 'Confirme';
      case 'approved': return 'Approuve';
      case 'rejected': return 'Rejete';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  {stat.trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {stat.trend}%
                    </div>
                  )}
                  {stat.alert && (
                    <div className="flex items-center gap-1 text-xs font-medium text-orange-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
                {stat.subValue && (
                  <p className="text-xs text-slate-400 mt-0.5">{stat.subValue}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`${stat.iconBg} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.title}</p>
                  </div>
                  {stat.alert && (
                    <AlertCircle className="w-4 h-4 text-orange-500 ml-auto" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-teal-600" />
              Commandes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {order.products?.name || 'Produit'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {order.pharmacies?.pharmacy_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className={`text-xs px-2 py-1 rounded-lg border ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                        {order.total_price} DZD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              Documents Recents
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {recentDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Aucun document</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {doc.document_type}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {doc.file_name}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg border flex items-center gap-1.5 ${getStatusStyle(doc.status)}`}>
                      {doc.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {doc.status === 'pending' && <Clock className="w-3 h-3" />}
                      {doc.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                      {getStatusLabel(doc.status)}
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
