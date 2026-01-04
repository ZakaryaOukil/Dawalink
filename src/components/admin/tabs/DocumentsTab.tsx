import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../ui/table';
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
  Eye,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approuve', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  rejected: { label: 'Rejete', color: 'bg-red-100 text-red-700', icon: XCircle }
};

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

  const documentTypes = [...new Set(documents.map(d => d.document_type))];

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
                <p className="text-sm text-slate-500">Total Documents</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">En Attente</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            {stats.pending > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-amber-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Necessite verification</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Approuves</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
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
                <p className="text-sm text-slate-500">Rejetes</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {documentTypes.map((type, index) => {
          const count = documents.filter(d => d.document_type === type).length;
          const pending = documents.filter(d => d.document_type === type && d.status === 'pending').length;
          return (
            <Badge
              key={index}
              variant="outline"
              className={`px-3 py-1 ${pending > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50'}`}
            >
              {type} ({count})
              {pending > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                  {pending}
                </span>
              )}
            </Badge>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Verification des Documents
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
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
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun document trouve</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Date Upload</TableHead>
                    <TableHead>Date Review</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => {
                    const config = statusConfig[doc.status] || statusConfig.pending;
                    const Icon = config.icon;
                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.document_type}</TableCell>
                        <TableCell className="text-slate-600 max-w-[200px] truncate">
                          {doc.file_name}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {doc.reviewed_at
                            ? new Date(doc.reviewed_at).toLocaleDateString('fr-FR')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={config.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {doc.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateDocumentStatus(doc.id, 'approved')}
                                  className="bg-emerald-600 hover:bg-emerald-700 h-8"
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
                              </>
                            )}
                            {doc.status !== 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setIsReviewOpen(true);
                                }}
                                className="h-8"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Voir
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.status === 'pending' ? 'Rejeter le Document' : 'Details du Document'}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument?.status === 'pending'
                ? 'Indiquez la raison du rejet'
                : 'Informations sur le document'}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg space-y-2">
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
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                  {selectedDocument.status === 'approved' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-emerald-700">
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
