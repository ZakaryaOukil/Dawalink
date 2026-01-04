import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
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
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { supabase } from '../../../lib/supabase';

interface Document {
  id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  status: string;
  uploaded_at: string;
  reviewed_at: string | null;
}

export function DocumentsTab() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocumentStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          status,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.map(d =>
        d.id === id ? { ...d, status, reviewed_at: new Date().toISOString() } : d
      ));

      setIsReviewOpen(false);
      setRejectionReason('');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle };
      case 'rejected':
        return { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle };
      default:
        return { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuve';
      case 'rejected': return 'Rejete';
      default: return 'En attente';
    }
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
              <div className="bg-slate-100 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-slate-600" />
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
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-sm text-slate-500">En Attente</p>
              </div>
            </div>
            {stats.pending > 0 && (
              <div className="mt-2 flex items-center gap-1 text-amber-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Necessite verification</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-slate-500">Approuves</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2.5 rounded-xl">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-slate-500">Rejetes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Verification des Documents
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-50 border-0">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuves</SelectItem>
                  <SelectItem value="rejected">Rejetes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <FileCheck className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Aucun document trouve</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => {
                const statusStyle = getStatusStyle(doc.status);
                const Icon = statusStyle.icon;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-slate-800">{doc.document_type}</p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate mt-0.5">
                          {doc.file_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-400">
                          {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {doc.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateDocumentStatus(doc.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 h-8"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setIsReviewOpen(true);
                            }}
                            className="h-8"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setIsReviewOpen(true);
                          }}
                          className="h-8"
                        >
                          Voir
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedDocument?.status === 'pending' ? 'Rejeter le Document' : 'Details du Document'}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Type:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {selectedDocument.document_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Fichier:</span>
                  <span className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
                    {selectedDocument.file_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Upload:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {new Date(selectedDocument.uploaded_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {selectedDocument.status === 'pending' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Raison du rejet (optionnel)
                  </label>
                  <Textarea
                    placeholder="Expliquez pourquoi le document est rejete..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {selectedDocument.status !== 'pending' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl ${
                  selectedDocument.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {selectedDocument.status === 'approved' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700">
                        Document approuve le{' '}
                        {selectedDocument.reviewed_at
                          ? new Date(selectedDocument.reviewed_at).toLocaleDateString('fr-FR')
                          : '-'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-700">
                        Document rejete le{' '}
                        {selectedDocument.reviewed_at
                          ? new Date(selectedDocument.reviewed_at).toLocaleDateString('fr-FR')
                          : '-'}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {selectedDocument?.status === 'pending' && (
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateDocumentStatus(selectedDocument.id, 'rejected')}
              >
                Confirmer le Rejet
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
