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
  DialogTitle,
  DialogDescription
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Fournisseurs</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Verifies</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.verified}</p>
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
                <p className="text-sm text-slate-500">Non Verifies</p>
                <p className="text-2xl font-bold text-amber-600">{stats.unverified}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <XCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Note Moyenne</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Liste des Fournisseurs
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
                  variant={filterVerified === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterVerified('all')}
                  className={filterVerified === 'all' ? 'bg-slate-800' : ''}
                >
                  Tous
                </Button>
                <Button
                  variant={filterVerified === 'verified' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterVerified('verified')}
                  className={filterVerified === 'verified' ? 'bg-emerald-600' : ''}
                >
                  Verifies
                </Button>
                <Button
                  variant={filterVerified === 'unverified' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterVerified('unverified')}
                  className={filterVerified === 'unverified' ? 'bg-amber-600' : ''}
                >
                  Non Verifies
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun fournisseur trouve</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>N Registre</TableHead>
                    <TableHead>Telephone</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.company_name}</TableCell>
                      <TableCell className="text-slate-600">{supplier.registry_number}</TableCell>
                      <TableCell className="text-slate-600">{supplier.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">
                            {supplier.average_rating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({supplier.total_reviews || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.is_verified ? 'default' : 'secondary'}
                          className={supplier.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {supplier.is_verified ? 'Verifie' : 'Non Verifie'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(supplier.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedSupplier(supplier);
                              setIsDetailOpen(true);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir Details
                            </DropdownMenuItem>
                            {!supplier.is_verified ? (
                              <DropdownMenuItem onClick={() => updateVerificationStatus(supplier.id, true)}>
                                <Check className="w-4 h-4 mr-2" />
                                Verifier
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => updateVerificationStatus(supplier.id, false)}
                                className="text-red-600"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Revoquer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Details du Fournisseur</DialogTitle>
            <DialogDescription>Informations completes</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{selectedSupplier.company_name}</h3>
                  <Badge variant={selectedSupplier.is_verified ? 'default' : 'secondary'}
                    className={selectedSupplier.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                    {selectedSupplier.is_verified ? 'Verifie' : 'Non Verifie'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-bold text-slate-800">
                      {selectedSupplier.average_rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedSupplier.total_reviews || 0} avis</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-lg font-bold text-slate-800">
                      {selectedSupplier.response_rate || 0}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Taux reponse</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">N Registre Commerce</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.registry_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telephone</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Adresse</p>
                    <p className="text-sm font-medium text-slate-800">{selectedSupplier.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Temps de reponse moyen</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedSupplier.avg_response_time || 0} heures
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date d'inscription</p>
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

              <div className="flex gap-3 pt-4">
                {!selectedSupplier.is_verified ? (
                  <Button
                    onClick={() => {
                      updateVerificationStatus(selectedSupplier.id, true);
                      setSelectedSupplier({ ...selectedSupplier, is_verified: true });
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Verifier
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateVerificationStatus(selectedSupplier.id, false);
                      setSelectedSupplier({ ...selectedSupplier, is_verified: false });
                    }}
                    className="flex-1"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Revoquer Verification
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
