import { Building2, Store, CheckCircle, Users, Package, Star, Search, FileCheck, TrendingUp, Shield, Zap, Clock, Phone, MessageCircle } from 'lucide-react';
import { UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: (type: UserType) => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DawaLink</h1>
                <p className="text-xs text-gray-500">Plateforme B2B</p>
              </div>
            </div>
            <button className="px-5 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
                <span className="text-xs text-slate-600">✨ Plateforme B2B Pharmaceutique</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Connectez <span className="text-teal-600">Fournisseurs</span> et <span className="text-blue-600">Pharmacies</span>
                </h2>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                  La plateforme qui simplifie l'approvisionnement en médicaments en Algérie.
                  Trouvez vos produits, contactez les agents commerciaux directement.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-teal-600 mb-1">500+</p>
                  <p className="text-xs lg:text-sm text-gray-600">Produits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">150+</p>
                  <p className="text-xs lg:text-sm text-gray-600">Pharmacies</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">4.8★</p>
                  <p className="text-xs lg:text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onGetStarted('pharmacy')}
                  className="flex-1 bg-blue-600 text-white py-3.5 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Store className="w-5 h-5" />
                    <span>Je suis Pharmacie</span>
                  </div>
                </button>
                <button
                  onClick={() => onGetStarted('supplier')}
                  className="flex-1 bg-teal-600 text-white py-3.5 px-6 rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>Je suis Fournisseur</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765031092161-a9ebe556117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwc2hlbHZlc3xlbnwxfHx8fDE3NjY4NTEwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy shelves with medicine"
                  className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Vérification</p>
                      <p className="text-xs text-gray-600">100% Sécurisée</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose DawaLink */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Pourquoi choisir DawaLink ?
            </h3>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète conçue pour faciliter les échanges entre professionnels de la santé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 - Security */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-40 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518730384-be3d205838e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjY3NDQ5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Business handshake"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Vérification Sécurisée</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tous les fournisseurs et pharmacies sont minutieusement vérifiés par nos administrateurs pour garantir la sécurité et la conformité.
                </p>
              </div>
            </div>

            {/* Card 2 - Direct Contact */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-40 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzY2ODUxMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Medical professionals"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact Direct & Rapide</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Contactez directement les agents commerciaux via téléphone, email, WhatsApp ou réseaux sociaux. Communication instantanée.
                </p>
              </div>
            </div>

            {/* Card 3 - Rating System */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-40 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1695048441368-e913925d1e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzY2ODUxMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Digital healthcare"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Système de Notation</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Évaluez les fournisseurs et consultez les avis vérifiés des autres pharmacies pour prendre les meilleures décisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Des fonctionnalités adaptées à vos besoins
            </h3>
            <p className="text-base lg:text-lg text-gray-600">
              Découvrez ce que DawaLink peut faire pour vous
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Pharmacies Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1715810491182-725428245fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMGN1c3RvbWVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjY4NTEwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-sm">Pour les Pharmacies</h3>
                    <p className="text-xs opacity-90">Trouvez et commandez facilement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suppliers Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739204618173-3e89def7140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjZXV0aWNhbCUyMHdhcmVob3VzZSUyMGRpc3RyaWJ1dGlvbnxlbnwxfHx8fDE3NjY4NTEwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Warehouse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-sm">Pour les Fournisseurs</h3>
                    <p className="text-xs opacity-90">Gérez et développez votre activité</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pharmacies Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Recherche intelligente</p>
                  <p className="text-xs text-gray-600">Trouvez instantanément vos médicaments par nom, référence ou catégorie avec filtres avancés</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Disponibilité en temps réel</p>
                  <p className="text-xs text-gray-600">Consultez les stocks et prix actualisés instantanément pour éviter les ruptures</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Contact direct simplifié</p>
                  <p className="text-xs text-gray-600">Accédez aux coordonnées complètes et contactez via WhatsApp, téléphone ou email</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Système d'évaluation</p>
                  <p className="text-xs text-gray-600">Consultez et partagez des avis pour choisir les meilleurs fournisseurs</p>
                </div>
              </div>
            </div>

            {/* Suppliers Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Gestion de catalogue simplifiée</p>
                  <p className="text-xs text-gray-600">Ajoutez vos produits manuellement ou importez votre catalogue complet via Excel</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Mises à jour instantanées</p>
                  <p className="text-xs text-gray-600">Modifiez prix, stocks et disponibilités en temps réel pour informer vos clients</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Réseau d'agents commerciaux</p>
                  <p className="text-xs text-gray-600">Gérez vos agents avec coordonnées complètes et liens réseaux sociaux</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Analyses et statistiques</p>
                  <p className="text-xs text-gray-600">Suivez vos performances, consultez les avis et améliorez votre service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-7 h-7 text-teal-600" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">24/7</p>
              <p className="text-xs lg:text-sm text-gray-600">Disponibilité</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">100%</p>
              <p className="text-xs lg:text-sm text-gray-600">Sécurité</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">150+</p>
              <p className="text-xs lg:text-sm text-gray-600">Partenaires</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">&lt;2h</p>
              <p className="text-xs lg:text-sm text-gray-600">Temps de réponse</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Prêt à commencer ?
          </h3>
          <p className="text-base lg:text-lg text-teal-50 mb-8 max-w-2xl mx-auto">
            Rejoignez DawaLink aujourd'hui et découvrez une nouvelle façon de gérer votre activité pharmaceutique
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <button
              onClick={() => onGetStarted('pharmacy')}
              className="flex-1 bg-white text-blue-700 py-3.5 px-6 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <Store className="w-5 h-5" />
                <span>Inscription Pharmacie</span>
              </div>
            </button>
            <button
              onClick={() => onGetStarted('supplier')}
              className="flex-1 bg-white text-teal-700 py-3.5 px-6 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>Inscription Fournisseur</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-white text-lg font-bold">DawaLink</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                La plateforme B2B qui connecte fournisseurs et pharmacies en Algérie pour un approvisionnement simplifié et sécurisé.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Liens rapides</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">À propos</a></li>
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">CGU</a></li>
                <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2025 DawaLink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}