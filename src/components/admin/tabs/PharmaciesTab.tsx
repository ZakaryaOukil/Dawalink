import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Eye,
  Ban,
  Check,
  Shield,
  ShieldOff
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

interface Pharmacy {
  id: string;
  pharmacy_name: string;
  license_number: string;
  phone: string;
  address: string;
  is_verified: boolean;
  is_blocked: boolean;
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
        .select('id, pharmacy_name, license_number, phone, address, is_verified, is_blocked, created_at')
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

  const updateBlockedStatus = async (id: string, isBlocked: boolean) => {
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating pharmacy blocked status:', error);
        throw error;
      }

      setPharmacies(prev => prev.map(p =>
        p.id === id ? { ...p, is_blocked: isBlocked } : p
      ));

      if (selectedPharmacy?.id === id) {
        setSelectedPharmacy({ ...selectedPharmacy, is_blocked: isBlocked });
      }
    } catch (error) {
      console.error('Error updating pharmacy blocked status:', error);
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
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Building2 className="w-5 h-5 text-blue-600" />
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
                <p className="text-sm text-slate-500">Verifiees</p>
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
                <p className="text-sm text-slate-500">Non Verifiees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Liste des Pharmacies
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
          {filteredPharmacies.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucune pharmacie trouvee</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800 truncate">{pharmacy.pharmacy_name}</p>
                        {pharmacy.is_blocked ? (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                            Bloque
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            pharmacy.is_verified
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {pharmacy.is_verified ? 'Verifie' : 'Non Verifie'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">Licence:</span> {pharmacy.license_number}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {pharmacy.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-slate-400 hidden md:block mr-2">
                      {new Date(pharmacy.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPharmacy(pharmacy);
                        setIsDetailOpen(true);
                      }}
                      className="h-8 px-3"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Details
                    </Button>
                    {!pharmacy.is_verified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateVerificationStatus(pharmacy.id, true)}
                        className="h-8 px-3 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        Verifier
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateVerificationStatus(pharmacy.id, false)}
                        className="h-8 px-3 text-amber-600 border-amber-600 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Ban className="w-4 h-4 mr-1.5" />
                        Revoquer
                      </Button>
                    )}
                    {!pharmacy.is_blocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBlockedStatus(pharmacy.id, true)}
                        className="h-8 px-3 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <ShieldOff className="w-4 h-4 mr-1.5" />
                        Bloquer
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBlockedStatus(pharmacy.id, false)}
                        className="h-8 px-3 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        <Shield className="w-4 h-4 mr-1.5" />
                        Debloquer
                      </Button>
                    )}
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
            <DialogTitle className="text-lg font-semibold">Details de la Pharmacie</DialogTitle>
          </DialogHeader>
          {selectedPharmacy && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{selectedPharmacy.pharmacy_name}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    selectedPharmacy.is_verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedPharmacy.is_verified ? 'Verifie' : 'Non Verifie'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Numero de Licence</p>
                    <p className="text-sm font-medium text-slate-800">{selectedPharmacy.license_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Telephone</p>
                    <p className="text-sm font-medium text-slate-800">{selectedPharmacy.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Adresse</p>
                    <p className="text-sm font-medium text-slate-800">{selectedPharmacy.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Date d'inscription</p>
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

              <div className="pt-2 space-y-2">
                {selectedPharmacy.is_blocked ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                      <ShieldOff className="w-4 h-4" />
                      Ce compte est actuellement bloque
                    </p>
                  </div>
                ) : (
                  <>
                    {!selectedPharmacy.is_verified ? (
                      <Button
                        onClick={() => {
                          updateVerificationStatus(selectedPharmacy.id, true);
                          setSelectedPharmacy({ ...selectedPharmacy, is_verified: true });
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Verifier cette Pharmacie
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          updateVerificationStatus(selectedPharmacy.id, false);
                          setSelectedPharmacy({ ...selectedPharmacy, is_verified: false });
                        }}
                        className="w-full"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Revoquer la Verification
                      </Button>
                    )}
                  </>
                )}
                {!selectedPharmacy.is_blocked ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateBlockedStatus(selectedPharmacy.id, true);
                      setSelectedPharmacy({ ...selectedPharmacy, is_blocked: true });
                    }}
                    className="w-full"
                  >
                    <ShieldOff className="w-4 h-4 mr-2" />
                    Bloquer ce Compte
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      updateBlockedStatus(selectedPharmacy.id, false);
                      setSelectedPharmacy({ ...selectedPharmacy, is_blocked: false });
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Debloquer ce Compte
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
