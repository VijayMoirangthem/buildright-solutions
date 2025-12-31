import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Calendar, FileText, Plus, Download, Pencil, Trash2, Paperclip, ExternalLink, Image } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useStorage, StoredFile } from '@/contexts/StorageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { BackButton } from '@/components/admin/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { exportToCSV } from '@/lib/exportUtils';
import { EditClientModal } from '@/components/admin/EditClientModal';
import { FileUpload } from '@/components/admin/FileUpload';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

import { FinancialRecord } from '@/data/mockData';

export default function ClientDetailPage() {
  const { id } = useParams();
  const { clients, updateClient, resources, updateResource } = useData();
  const { getFilesByLink, deleteFile, formatBytes } = useStorage();
  const { goBack } = useNavigation();
  
  const client = clients.find((c) => c.id === id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateClient = (data: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    projectId?: string;
  }) => {
    if (client) {
      updateClient(client.id, data);
      setIsEditModalOpen(false);
      toast.success('Client updated successfully!');
    }
  };

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(
    (client?.financialRecords || []).map(r => ({
      ...r,
      attachments: r.attachments || [],
    }))
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'Received' as 'Received' | 'Due',
    notes: '',
    attachments: [] as string[],
    resourceType: '',
    resourceQuantity: '',
  });

  // Get available resource types for linking
  const availableResources = resources.filter(r => 
    !client?.projectId || r.projectId === client.projectId
  );

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Client not found</p>
        <Link to="/admin/clients">
          <Button variant="outline">
            <BackButton />
            Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  const totalReceived = financialRecords
    .filter((r) => r.type === 'Received')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalDue = financialRecords
    .filter((r) => r.type === 'Due')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleFileUploaded = (file: StoredFile) => {
    setNewRecord(prev => ({
      ...prev,
      attachments: [...prev.attachments, file.id],
    }));
  };

  const handleAddRecord = () => {
    if (!newRecord.amount || Number(newRecord.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const record: FinancialRecord = {
      id: String(Date.now()),
      date: newRecord.date,
      amount: Number(newRecord.amount),
      type: newRecord.type,
      notes: newRecord.notes,
      attachments: newRecord.attachments,
      resourceType: newRecord.resourceType || undefined,
      resourceQuantity: newRecord.resourceQuantity ? Number(newRecord.resourceQuantity) : undefined,
    };

    // Update resource if linked
    if (record.resourceType && record.resourceQuantity) {
      const resource = resources.find(r => r.type === record.resourceType);
      if (resource) {
        const newUsed = resource.used + record.resourceQuantity;
        updateResource(resource.id, {
          used: newUsed,
          remaining: resource.quantityPurchased - newUsed,
        });
        toast.success(`Resource "${record.resourceType}" updated: ${record.resourceQuantity} ${resource.unit} used`);
      }
    }

    const updated = [record, ...financialRecords];
    setFinancialRecords(updated);
    updateClient(client.id, { financialRecords: updated });
    setNewRecord({ 
      date: new Date().toISOString().split('T')[0], 
      amount: '', 
      type: 'Received', 
      notes: '',
      attachments: [],
      resourceType: '',
      resourceQuantity: '',
    });
    setIsAddModalOpen(false);
    toast.success('Record added successfully!');
  };

  const handleUpdateRecord = () => {
    if (!editingRecord || !newRecord.amount) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Handle resource quantity difference
    if (newRecord.resourceType && newRecord.resourceQuantity) {
      const oldQty = editingRecord.resourceQuantity || 0;
      const newQty = Number(newRecord.resourceQuantity);
      const diff = newQty - oldQty;

      if (diff !== 0) {
        const resource = resources.find(r => r.type === newRecord.resourceType);
        if (resource) {
          const newUsed = resource.used + diff;
          updateResource(resource.id, {
            used: newUsed,
            remaining: resource.quantityPurchased - newUsed,
          });
        }
      }
    }

    const updated = financialRecords.map(r =>
      r.id === editingRecord.id
        ? { 
            ...r, 
            date: newRecord.date, 
            amount: Number(newRecord.amount), 
            type: newRecord.type, 
            notes: newRecord.notes,
            attachments: newRecord.attachments,
            resourceType: newRecord.resourceType || undefined,
            resourceQuantity: newRecord.resourceQuantity ? Number(newRecord.resourceQuantity) : undefined,
          }
        : r
    );
    setFinancialRecords(updated);
    updateClient(client.id, { financialRecords: updated });
    setEditingRecord(null);
    setNewRecord({ 
      date: new Date().toISOString().split('T')[0], 
      amount: '', 
      type: 'Received', 
      notes: '',
      attachments: [],
      resourceType: '',
      resourceQuantity: '',
    });
    toast.success('Record updated successfully!');
  };

  const handleDeleteRecord = () => {
    if (!deletingRecordId) return;
    
    const record = financialRecords.find(r => r.id === deletingRecordId);
    
    // Revert resource usage
    if (record?.resourceType && record?.resourceQuantity) {
      const resource = resources.find(r => r.type === record.resourceType);
      if (resource) {
        const newUsed = Math.max(0, resource.used - record.resourceQuantity);
        updateResource(resource.id, {
          used: newUsed,
          remaining: resource.quantityPurchased - newUsed,
        });
      }
    }

    // Delete associated files
    record?.attachments?.forEach(fileId => deleteFile(fileId));

    const updated = financialRecords.filter(r => r.id !== deletingRecordId);
    setFinancialRecords(updated);
    updateClient(client.id, { financialRecords: updated });
    setDeletingRecordId(null);
    toast.success('Record deleted successfully!');
  };

  const openEditModal = (record: FinancialRecord) => {
    setNewRecord({
      date: record.date,
      amount: String(record.amount),
      type: record.type,
      notes: record.notes,
      attachments: record.attachments || [],
      resourceType: record.resourceType || '',
      resourceQuantity: record.resourceQuantity ? String(record.resourceQuantity) : '',
    });
    setEditingRecord(record);
  };

  interface ClientFinancialExportData {
    [key: string]: unknown;
    name: string;
    phone: string;
    email: string;
    address: string;
    dateAdded: string;
    clientNotes: string;
    recordDate: string;
    amount: number | string;
    type: 'Received' | 'Due' | 'N/A';
    recordNotes: string;
  }

  const handleDownload = () => {
    if (!client) {
      toast.error("Client data not available for download.");
      return;
    }

    const baseClientData = {
      name: client.name,
      phone: client.phone,
      email: client.email || 'N/A',
      address: client.address || 'N/A',
      dateAdded: new Date(client.dateAdded).toLocaleDateString('en-IN'),
      clientNotes: client.notes || 'N/A',
    };

    let dataToExport: ClientFinancialExportData[] = [];
    let columns: { key: keyof ClientFinancialExportData; header: string }[] = [
      { key: 'name', header: 'Client Name' },
      { key: 'phone', header: 'Phone' },
      { key: 'email', header: 'Email' },
      { key: 'address', header: 'Address' },
      { key: 'dateAdded', header: 'Date Added' },
      { key: 'clientNotes', header: 'Client Notes' },
    ];

    if (financialRecords.length > 0) {
      dataToExport = financialRecords.map(record => ({
        ...baseClientData,
        recordDate: new Date(record.date).toLocaleDateString('en-IN'),
        amount: record.amount,
        type: record.type,
        recordNotes: record.notes || 'N/A',
      }));
      columns = columns.concat([
        { key: 'recordDate', header: 'Record Date' },
        { key: 'amount', header: 'Amount (₹)' },
        { key: 'type', header: 'Type' },
        { key: 'recordNotes', header: 'Record Notes' },
      ]);
    } else {
      dataToExport.push({
        ...baseClientData,
        recordDate: 'N/A',
        amount: 'N/A',
        type: 'N/A',
        recordNotes: 'N/A',
      });
      columns = columns.concat([
        { key: 'recordDate', header: 'Record Date' },
        { key: 'amount', header: 'Amount (₹)' },
        { key: 'type', header: 'Type' },
        { key: 'recordNotes', header: 'Record Notes' },
      ]);
    }

    exportToCSV(dataToExport, `client_${client.name.replace(/\s/g, '_')}_details_and_financials`, columns);
    toast.success('Client data and financial records exported to CSV!');
  };

  const getRecordFiles = (recordId: string) => {
    return getFilesByLink('client', client.id, recordId);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <BackButton />
        <Button variant="outline" size="icon" onClick={handleDownload} className="h-9 w-9">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Client Info Card */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border py-3 px-4">
          <CardTitle className="text-xl font-bold text-foreground">{client.name}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" />
              <a href={`tel:${client.phone}`} className="text-sm hover:underline">
                {client.phone}
              </a>
            </div>
            {client.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${client.email}`} className="text-sm hover:underline">
                  {client.email}
                </a>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {client.address}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Joined: {new Date(client.dateAdded).toLocaleDateString('en-IN')}</span>
            </div>
            {client.notes && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{client.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Records */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Financial Records</CardTitle>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {financialRecords.length > 0 ? (
              financialRecords.map((record) => {
                const files = getRecordFiles(record.id);
                return (
                  <div key={record.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">
                            ₹{record.amount.toLocaleString('en-IN')}
                          </p>
                          <Badge variant={record.type === 'Received' ? 'default' : 'destructive'} className="text-xs">
                            {record.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString('en-IN')}
                          {record.notes && ` • ${record.notes}`}
                        </p>
                        {record.resourceType && (
                          <p className="text-xs text-primary mt-1">
                            Resource: {record.resourceType} ({record.resourceQuantity} used)
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(record)}>
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingRecordId(record.id)}>
                          <Trash2 className="w-4 h-4 text-danger" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Attachments */}
                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                          >
                            {file.type.startsWith('image/') ? (
                              <Image className="w-3 h-3" />
                            ) : (
                              <Paperclip className="w-3 h-3" />
                            )}
                            <span className="truncate max-w-[100px]">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No financial records yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Record Modal */}
      <Dialog open={isAddModalOpen || !!editingRecord} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setEditingRecord(null);
          setNewRecord({ 
            date: new Date().toISOString().split('T')[0], 
            amount: '', 
            type: 'Received', 
            notes: '',
            attachments: [],
            resourceType: '',
            resourceQuantity: '',
          });
        }
      }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit Record' : 'Add Financial Record'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (₹) *</label>
              <Input
                type="number"
                value={newRecord.amount}
                onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={newRecord.type}
                onValueChange={(value) => setNewRecord({ ...newRecord, type: value as 'Received' | 'Due' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Due">Due</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resource Linking */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Resource (Optional)</label>
              <Select
                value={newRecord.resourceType}
                onValueChange={(value) => setNewRecord({ ...newRecord, resourceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableResources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.type}>
                      {resource.type} ({resource.remaining} {resource.unit} left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newRecord.resourceType && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity Used</label>
                <Input
                  type="number"
                  value={newRecord.resourceQuantity}
                  onChange={(e) => setNewRecord({ ...newRecord, resourceQuantity: e.target.value })}
                  placeholder="0"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                placeholder="Optional notes..."
                rows={2}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <FileUpload
                onFileUploaded={handleFileUploaded}
                linkedTo={{ 
                  type: 'client', 
                  id: client.id, 
                  recordId: editingRecord?.id || String(Date.now()) 
                }}
              />
              {newRecord.attachments.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {newRecord.attachments.length} file(s) attached
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setEditingRecord(null);
                setNewRecord({ 
                  date: new Date().toISOString().split('T')[0], 
                  amount: '', 
                  type: 'Received', 
                  notes: '',
                  attachments: [],
                  resourceType: '',
                  resourceQuantity: '',
                });
              }} className="flex-1">
                Cancel
              </Button>
              <Button onClick={editingRecord ? handleUpdateRecord : handleAddRecord} className="flex-1">
                {editingRecord ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      {client && (
        <EditClientModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          client={client}
          onUpdate={handleUpdateClient}
        />
      )}

      <AlertDialog open={!!deletingRecordId} onOpenChange={(open) => !open && setDeletingRecordId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This will also delete attached files and revert resource usage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecord} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
