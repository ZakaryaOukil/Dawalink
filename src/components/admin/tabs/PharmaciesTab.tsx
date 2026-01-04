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
  Building2,
  Phone,
  MapPin,
  Calendar,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  Check
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

interface Pharmacy {
  id: string;
  pharmacy_name: string;
  license_number: string;
  phone: string;
  address: string;
  is_verified: boolean;
  created_at: string;
}

export function PharmaciesTab() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPharmacies(data || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVerificationStatus = async (id: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setPharmacies(prev => prev.map(p =>
        p.id === id ? { ...p, is_verified: isVerified } : p
      ));
    } catch (error) {
      console.error('Error updating pharmacy:', error);
    }
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch =
      pharmacy.pharmacy_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.phone.includes(searchTerm);

    const matchesFilter =
      filterVerified === 'all' ||
      (filterVerified === 'verified' && pharmacy.is_verified) ||
      (filterVerified === 'unverified' && !pharmacy.is_verified);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: pharmacies.length,
    verified: pharmacies.filter(p => p.is_verified).length,
    unverified: pharmacies.filter(p => !p.is_verified).length
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Pharmacies</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Verifiees</p>
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
                <p className="text-sm text-slate-500">Non Verifiees</p>
                <p className="text-2xl font-bold text-amber-600">{stats.unverified}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <XCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Liste des Pharmacies
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
          {filteredPharmacies.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune pharmacie trouvee</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pharmacie</TableHead>
                    <TableHead>N Licence</TableHead>
                    <TableHead>Telephone</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell className="font-medium">{pharmacy.pharmacy_name}</TableCell>
                      <TableCell className="text-slate-600">{pharmacy.license_number}</TableCell>
                      <TableCell className="text-slate-600">{pharmacy.phone}</TableCell>
                      <TableCell className="text-slate-600 max-w-[200px] truncate">
                        {pharmacy.address}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pharmacy.is_verified ? 'default' : 'secondary'}
                          className={pharmacy.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {pharmacy.is_verified ? 'Verifie' : 'Non Verifie'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(pharmacy.created_at).toLocaleDateString('fr-FR')}
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
                              setSelectedPharmacy(pharmacy);
                              setIsDetailOpen(true);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir Details
                            </DropdownMenuItem>
                            {!pharmacy.is_verified ? (
                              <DropdownMenuItem onClick={() => updateVerificationStatus(pharmacy.id, true)}>
                                <Check className="w-4 h-4 mr-2" />
                                Verifier
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => updateVerificationStatus(pharmacy.id, false)}
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
            <DialogTitle>Details de la Pharmacie</DialogTitle>
            <DialogDescription>Informations completes</DialogDescription>
          </DialogHeader>
          {selectedPharmacy && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{selectedPharmacy.pharmacy_name}</h3>
                  <Badge variant={selectedPharmacy.is_verified ? 'default' : 'secondary'}
                    className={selectedPharmacy.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                    {selectedPharmacy.is_verified ? 'Verifie' : 'Non Verifie'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">N Licence</p>
                    <p className="text-sm font-medium text-slate-800">{selectedPharmacy.license_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telephone</p>
                    <p className="text-sm font-medium text-slate-800">{selectedPharmacy.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Adresse</p>
                    <p className="text-sm font-medium text-slate-800">{selectedPharmacy.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date d'inscription</p>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(selectedPharmacy.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!selectedPharmacy.is_verified ? (
                  <Button
                    onClick={() => {
                      updateVerificationStatus(selectedPharmacy.id, true);
                      setSelectedPharmacy({ ...selectedPharmacy, is_verified: true });
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
                      updateVerificationStatus(selectedPharmacy.id, false);
                      setSelectedPharmacy({ ...selectedPharmacy, is_verified: false });
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
