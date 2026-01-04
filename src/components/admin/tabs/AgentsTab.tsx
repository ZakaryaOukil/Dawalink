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
  Users,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Eye,
  MessageCircle,
  Linkedin,
  Facebook
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Agents</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Regions Couvertes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.regions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Fournisseurs Representes</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.suppliers}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {regions.map((region, index) => {
          const count = agents.filter(a => a.region === region).length;
          return (
            <Badge key={index} variant="outline" className="px-3 py-1 bg-slate-50">
              {region} ({count})
            </Badge>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Liste des Agents Commerciaux
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, email, region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun agent trouve</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telephone</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Reseaux</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="text-slate-600">
                        {agent.suppliers?.company_name || '-'}
                      </TableCell>
                      <TableCell className="text-slate-600">{agent.email}</TableCell>
                      <TableCell className="text-slate-600">{agent.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {agent.region}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAgent(agent);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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
            <DialogTitle>Details de l'Agent</DialogTitle>
            <DialogDescription>Informations de contact</DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{selectedAgent.name}</h3>
                  <p className="text-sm text-slate-500">
                    {selectedAgent.suppliers?.company_name || 'Agent independant'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAgent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telephone</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAgent.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Region</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAgent.region}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-2">Reseaux sociaux</p>
                <div className="flex gap-3">
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
