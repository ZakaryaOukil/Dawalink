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
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Building2,
  Truck
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  pharmacies: {
    pharmacy_name: string;
  } | null;
  suppliers: {
    company_name: string;
  } | null;
}

interface SupplierRating {
  id: string;
  company_name: string;
  average_rating: number;
  total_reviews: number;
}

export function RatingsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reviewsRes, suppliersRes] = await Promise.all([
        supabase
          .from('reviews')
          .select(`
            *,
            pharmacies(pharmacy_name),
            suppliers(company_name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('suppliers')
          .select('id, company_name, average_rating, total_reviews')
          .order('average_rating', { ascending: false })
      ]);

      if (reviewsRes.error) throw reviewsRes.error;
      if (suppliersRes.error) throw suppliersRes.error;

      setReviews(reviewsRes.data || []);
      setSuppliers(suppliersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.pharmacies?.pharmacy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.suppliers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterRating === 'all' ||
      (filterRating === '5' && review.rating === 5) ||
      (filterRating === '4' && review.rating === 4) ||
      (filterRating === '3' && review.rating === 3) ||
      (filterRating === '2' && review.rating === 2) ||
      (filterRating === '1' && review.rating === 1);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
    fiveStars: reviews.filter(r => r.rating === 5).length,
    lowRatings: reviews.filter(r => r.rating <= 2).length
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`}
          />
        ))}
      </div>
    );
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
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.totalReviews}</p>
                <p className="text-sm text-slate-500">Total Avis</p>
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
                <div className="flex items-center gap-1.5">
                  <p className="text-2xl font-bold text-slate-800">{stats.averageRating}</p>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-sm text-slate-500">Note Moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.fiveStars}</p>
                <p className="text-sm text-slate-500">5 Etoiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2.5 rounded-xl">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.lowRatings}</p>
                <p className="text-sm text-slate-500">1-2 Etoiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Distribution des Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-slate-700">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        rating >= 4 ? 'bg-green-500' :
                        rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-10 text-right">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Top Fournisseurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suppliers.filter(s => s.total_reviews > 0).length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Aucune evaluation pour le moment</p>
              </div>
            ) : (
              <div className="space-y-2">
                {suppliers
                  .filter(s => s.total_reviews > 0)
                  .slice(0, 5)
                  .map((supplier, index) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                          ${index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-slate-400' :
                            index === 2 ? 'bg-amber-600' : 'bg-slate-300'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{supplier.company_name}</p>
                          <p className="text-xs text-slate-500">{supplier.total_reviews} avis</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(supplier.average_rating))}
                        <span className="text-sm font-semibold text-slate-800">
                          {supplier.average_rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Tous les Avis
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
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-50 border-0">
                  <SelectValue placeholder="Note" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  <SelectItem value="5">5 etoiles</SelectItem>
                  <SelectItem value="4">4 etoiles</SelectItem>
                  <SelectItem value="3">3 etoiles</SelectItem>
                  <SelectItem value="2">2 etoiles</SelectItem>
                  <SelectItem value="1">1 etoile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucun avis trouve</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-slate-800">
                            {review.pharmacies?.pharmacy_name || '-'}
                          </p>
                          {renderStars(review.rating)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <Truck className="w-3.5 h-3.5" />
                          <span>{review.suppliers?.company_name || '-'}</span>
                        </div>
                        {review.comment && (
                          <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </span>
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
