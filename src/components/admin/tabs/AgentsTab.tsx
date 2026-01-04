import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Search,
  Loader2,
  Users,
  Phone,
  Mail,
  MapPin,
  Eye,
  MessageCircle,
  Linkedin,
  Facebook
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../ui/dialog';
import { supabase } from '../../../lib/supabase';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp: string | null;
  facebook: string | null;
  linkedin: string | null;
  region: string;
  created_at: string;
  suppliers: {
    company_name: string;
  } | null;
}

export function AgentsTab() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('commercial_agents')
        .select(`
          *,
          suppliers(company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.suppliers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regions = [...new Set(agents.map(a => a.region))];
  const stats = {
    total: agents.length,
    regions: regions.length,
    suppliers: [...new Set(agents.map(a => a.suppliers?.company_name).filter(Boolean))].length
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
              <div className="bg-slate-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-sm text-slate-500">Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.regions}</p>
                <p className="text-sm text-slate-500">Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.suppliers}</p>
                <p className="text-sm text-slate-500">Fournisseurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Liste des Agents Commerciaux
            </CardTitle>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-80 bg-slate-50 border-0"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucun agent trouve</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-800">{agent.name}</p>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {agent.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>{agent.suppliers?.company_name || 'Independant'}</span>
                        <span className="text-slate-300">|</span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {agent.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="hidden md:flex items-center gap-1.5">
                      {agent.whatsapp && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                      {agent.facebook && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Facebook className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {agent.linkedin && (
                        <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center">
                          <Linkedin className="w-3 h-3 text-sky-600" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
            <DialogTitle className="text-lg font-semibold">Details de l'Agent</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{selectedAgent.name}</h3>
                  <p className="text-sm text-slate-500">
                    {selectedAgent.suppliers?.company_name || 'Agent independant'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAgent.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Telephone</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAgent.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Region</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAgent.region}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-3">Reseaux sociaux</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.whatsapp && (
                    <a
                      href={`https://wa.me/${selectedAgent.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                  {selectedAgent.facebook && (
                    <a
                      href={selectedAgent.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {selectedAgent.linkedin && (
                    <a
                      href={selectedAgent.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg text-sm hover:bg-sky-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
                {!selectedAgent.whatsapp && !selectedAgent.facebook && !selectedAgent.linkedin && (
                  <p className="text-sm text-slate-400">Aucun reseau social renseigne</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
