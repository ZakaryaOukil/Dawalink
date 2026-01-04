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
      ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
      : '0.00'
  };

  const categories = [...new Set(products.map(p => p.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Produits</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Disponibles</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Stock Total</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStock}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Prix Moyen</p>
                <p className="text-2xl font-bold text-slate-800">{stats.avgPrice} DH</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.slice(0, 6).map((category, index) => {
          const count = products.filter(p => p.category === category).length;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-500 truncate">{category}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Catalogue Produits
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
              <div className="flex gap-2">
                <Button
                  variant={filterAvailable === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterAvailable('all')}
                  className={filterAvailable === 'all' ? 'bg-slate-800' : ''}
                >
                  Tous
                </Button>
                <Button
                  variant={filterAvailable === 'available' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterAvailable('available')}
                  className={filterAvailable === 'available' ? 'bg-emerald-600' : ''}
                >
                  Disponibles
                </Button>
                <Button
                  variant={filterAvailable === 'unavailable' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterAvailable('unavailable')}
                  className={filterAvailable === 'unavailable' ? 'bg-red-600' : ''}
                >
                  Indisponibles
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun produit trouve</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-slate-600">{product.reference}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {product.suppliers?.company_name || '-'}
                      </TableCell>
                      <TableCell className="font-medium">{product.price} DH</TableCell>
                      <TableCell>
                        <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.available ? 'default' : 'secondary'}
                          className={product.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                          {product.available ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
