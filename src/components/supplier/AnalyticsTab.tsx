import { Star, TrendingUp, Users, Eye } from 'lucide-react';

export function AnalyticsTab() {
  const recentReviews = [
    {
      id: '1',
      pharmacy: 'Pharmacie Centrale',
      rating: 5,
      comment: 'Excellent service, livraison rapide et produits de qualité',
      date: '2025-12-20'
    },
    {
      id: '2',
      pharmacy: 'Pharmacie Al Amal',
      rating: 4,
      comment: 'Bons produits mais délai de livraison un peu long',
      date: '2025-12-18'
    },
    {
      id: '3',
      pharmacy: 'Pharmacie du Coin',
      rating: 5,
      comment: 'Très satisfait, je recommande vivement',
      date: '2025-12-15'
    },
  ];

  return (
    <div>
      <h2 className="mb-6 text-gray-900">Statistiques et Avis</h2>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Note moyenne</p>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl text-gray-900">4.8</p>
          <p className="text-sm text-gray-500 mt-1">Sur 156 avis</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Vues produits</p>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl text-gray-900">2,847</p>
          <p className="text-sm text-green-600 mt-1">+12% ce mois</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Pharmacies actives</p>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl text-gray-900">43</p>
          <p className="text-sm text-green-600 mt-1">+5 ce mois</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Taux de réponse</p>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl text-gray-900">94%</p>
          <p className="text-sm text-gray-500 mt-1">Temps moyen: 2h</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="mb-6 text-gray-900">Distribution des notes</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm text-gray-700">{stars}</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{
                    width: stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : '3%'
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {stars === 5 ? '109' : stars === 4 ? '31' : stars === 3 ? '11' : '5'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="mb-6 text-gray-900">Avis récents</h3>
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-900">{review.pharmacy}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
