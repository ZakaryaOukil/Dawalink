import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import {
  Search,
  Loader2,
  Package,
  DollarSign,
  Layers,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Product {
  id: string;
  name: string;
  reference: string;
  category: string;
  price: number;
  stock: number;
  available: boolean;
  created_at: string;
  suppliers: {
    company_name: string;
  } | null;
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState<'all' | 'available' | 'unavailable'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          suppliers(company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterAvailable === 'all' ||
      (filterAvailable === 'available' && product.available) ||
      (filterAvailable === 'unavailable' && !product.available);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: products.length,
    available: products.filter(p => p.available).length,
    totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    avgPrice: products.length > 0
      ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)
      : '0'
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
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-sm text-slate-500">Produits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                <p className="text-sm text-slate-500">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStock}</p>
                <p className="text-sm text-slate-500">Stock Total</p>
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
                <p className="text-2xl font-bold text-teal-600">{stats.avgPrice} DH</p>
                <p className="text-sm text-slate-500">Prix Moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Catalogue Produits
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
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                  { value: 'all', label: 'Tous' },
                  { value: 'available', label: 'Disponibles' },
                  { value: 'unavailable', label: 'Indisponibles' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilterAvailable(option.value as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      filterAvailable === option.value
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucun produit trouve</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-800 truncate">{product.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          product.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.available ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">Ref:</span> {product.reference}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">{product.category}</span>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <span className="hidden sm:inline">{product.suppliers?.company_name || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right hidden md:block">
                      <p className="font-semibold text-slate-800">{product.price} DH</p>
                      <p className={`text-xs ${product.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                        Stock: {product.stock}
                      </p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      {product.available ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
