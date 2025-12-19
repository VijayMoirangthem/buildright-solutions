import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, Plus, Download, Pencil, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { exportToCSV } from '@/lib/exportUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface FinancialRecord {
  id: string;
  date: string;
  amount: number;
  type: 'Received' | 'Due';
  notes: string;
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const { clients, updateClient } = useData();
  const client = clients.find((c) => c.id === id);
  
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(
    client?.financialRecords || []
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'Received' as 'Received' | 'Due',
    notes: '',
  });

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Client not found</p>
        <Link to="/admin/clients">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
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
    };
    
    const updated = [record, ...financialRecords];
    setFinancialRecords(updated);
    updateClient(client.id, { financialRecords: updated });
    setNewRecord({ date: new Date().toISOString().split('T')[0], amount: '', type: 'Received', notes: '' });
    setIsAddModalOpen(false);
    toast.success('Record added successfully!');
  };

  const handleUpdateRecord = () => {
    if (!editingRecord || !newRecord.amount) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const updated = financialRecords.map(r => 
      r.id === editingRecord.id 
        ? { ...r, date: newRecord.date, amount: Number(newRecord.amount), type: newRecord.type, notes: newRecord.notes }
        : r
    );
    setFinancialRecords(updated);
    updateClient(client.id, { financialRecords: updated });
    setEditingRecord(null);
    setNewRecord({ date: new Date().toISOString().split('T')[0], amount: '', type: 'Received', notes: '' });
    toast.success('Record updated successfully!');
  };

  const handleDeleteRecord = () => {
    if (!deletingRecordId) return;
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
    });
    setEditingRecord(record);
  };

interface ClientFinancialExportData {
  [key: string]: unknown; // Add index signature
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

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <Link
          to="/admin/clients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <Button variant="outline" size="icon" onClick={handleDownload} className="h-9 w-9">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Client Info Card */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-foreground mb-4">{client.name}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" />
              <span>{client.phone}</span>
            </div>
            {client.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{client.email}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{client.address}</span>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-card">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-success">₹{totalReceived.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-danger">₹{totalDue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">Due</p>
          </CardContent>
        </Card>
      </div>

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
              financialRecords.map((record) => (
                <div key={record.id} className="p-4 flex items-center justify-between">
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
              ))
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
          setNewRecord({ date: new Date().toISOString().split('T')[0], amount: '', type: 'Received', notes: '' });
        }
      }}>
        <DialogContent className="sm:max-w-md">
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                placeholder="Optional notes..."
                rows={2}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setEditingRecord(null);
                setNewRecord({ date: new Date().toISOString().split('T')[0], amount: '', type: 'Received', notes: '' });
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingRecordId} onOpenChange={(open) => !open && setDeletingRecordId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
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
