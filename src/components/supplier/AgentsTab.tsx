import { useState } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { AddAgentModal } from './AddAgentModal';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
  region: string;
}

export function AgentsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Ahmed Bennani',
      phone: '+213 XXX XXX XX1',
      email: 'ahmed.bennani@pharma.com',
      whatsapp: '+213 XXX XXX XX1',
      facebook: 'ahmed.bennani',
      linkedin: 'ahmed-bennani',
      region: 'Alger'
    },
    {
      id: '2',
      name: 'Fatima Alaoui',
      phone: '+213 XXX XXX XX2',
      email: 'fatima.alaoui@pharma.com',
      whatsapp: '+213 XXX XXX XX2',
      region: 'Oran'
    },
  ]);

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">Agents Commerciaux</h2>
          <p className="text-gray-600">
            Gérez vos agents commerciaux et leurs coordonnées
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un agent
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="mb-1 text-gray-900">{agent.name}</h4>
            <p className="text-sm text-gray-600 mb-4">{agent.region}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{agent.email}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Réseaux sociaux</p>
              <div className="flex gap-2">
                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {agent.facebook && (
                  <a
                    href={`https://facebook.com/${agent.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {agent.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${agent.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onAdd={(agent) => {
            setAgents([...agents, { ...agent, id: Date.now().toString() }]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}