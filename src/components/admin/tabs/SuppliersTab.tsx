import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Truck,
  Phone,
  MapPin,
  Calendar,
  Star,
  MoreVertical,
  Eye,
  Ban,
  Check,
  MessageSquare,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../ui/dialog';
import { supabase } from '../../../lib/supabase';

interface Supplier {
  id: string;
  company_name: string;
  registry_number: string;
  phone: string;
  address: string;
  average_rating: number;
  total_reviews: number;
  response_rate: number;
  avg_response_time: number;
  is_verified: boolean;
  created_at: string;
}

export function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVerificationStatus = async (id: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setSuppliers(prev => prev.map(s =>
        s.id === id ? { ...s, is_verified: isVerified } : s
      ));
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.registry_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm);

    const matchesFilter =
      filterVerified === 'all' ||
      (filterVerified === 'verified' && supplier.is_verified) ||
      (filterVerified === 'unverified' && !supplier.is_verified);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: suppliers.length,
    verified: suppliers.filter(s => s.is_verified).length,
    unverified: suppliers.filter(s => !s.is_verified).length,
    avgRating: suppliers.length > 0
      ? (suppliers.reduce((sum, s) => sum + (s.average_rating || 0), 0) / suppliers.length).toFixed(1)
      : '0.0'
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
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <Truck className="w-5 h-5 text-emerald-600" />
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
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                <p className="text-sm text-slate-500">Verifies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <XCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.unverified}</p>
                <p className="text-sm text-slate-500">Non Verifies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
                <p className="text-sm text-slate-500">Note Moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Liste des Fournisseurs
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
                  { value: 'verified', label: 'Verifies' },
                  { value: 'unverified', label: 'Non Verifies' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilterVerified(option.value as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      filterVerified === option.value
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
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-16">
              <Truck className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucun fournisseur trouve</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-800 truncate">{supplier.company_name}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          supplier.is_verified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {supplier.is_verified ? 'Verifie' : 'Non Verifie'}
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-slate-700">{supplier.average_rating?.toFixed(1) || '0.0'}</span>
                          <span className="text-slate-400">({supplier.total_reviews || 0})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">RC:</span> {supplier.registry_number}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {supplier.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-slate-400 hidden md:block">
                      {new Date(supplier.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDetailOpen(true);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir Details
                        </DropdownMenuItem>
                        {!supplier.is_verified ? (
                          <DropdownMenuItem onClick={() => updateVerificationStatus(supplier.id, true)} className="text-green-600">
                            <Check className="w-4 h-4 mr-2" />
                            Verifier
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateVerificationStatus(supplier.id, false)} className="text-red-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Revoquer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Details du Fournisseur</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{selectedSupplier.company_name}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    selectedSupplier.is_verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedSupplier.is_verified ? 'Verifie' : 'Non Verifie'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-yellow-50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-bold text-slate-800">
                      {selectedSupplier.average_rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedSupplier.total_reviews || 0} avis</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-lg font-bold text-slate-800">
                      {selectedSupplier.response_rate || 0}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Taux reponse</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Registre Commerce</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.registry_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Telephone</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Adresse</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Temps de reponse moyen</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.avg_response_time || 0} heures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Date d'inscription</p>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(selectedSupplier.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {!selectedSupplier.is_verified ? (
                  <Button
                    onClick={() => {
                      updateVerificationStatus(selectedSupplier.id, true);
                      setSelectedSupplier({ ...selectedSupplier, is_verified: true });
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Verifier ce Fournisseur
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateVerificationStatus(selectedSupplier.id, false);
                      setSelectedSupplier({ ...selectedSupplier, is_verified: false });
                    }}
                    className="w-full"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Revoquer la Verification
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
