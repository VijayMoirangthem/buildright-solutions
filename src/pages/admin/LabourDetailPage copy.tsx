import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, FileText, CheckCircle, XCircle, Plus, IndianRupee, Pencil, Trash2, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { exportToCSV } from '@/lib/exportUtils';

interface DailyRecord {
  id: string;
  date: string;
  attendance: 'Present' | 'Absent' | 'Overtime' | 'Half day' | '';
  amountPaid: number;
  notes: string;
}

interface LabourDailyRecordExportData {
  [key: string]: unknown;
  name?: string;
  phone?: string;
  address?: string;
  dateJoined?: string;
  labourNotes?: string;
  status?: 'Active' | 'Inactive';
  totalFullDays?: number;
  totalHalfDays?: number;
  totalAbsent?: number;
  totalOvertime?: number;
  totalPaid?: number;
  totalPaidThisMonth?: number;
  recordDate?: string;
  attendance?: 'Present' | 'Absent' | 'Overtime' | 'Half day' | 'N/A';
  amountPaid?: number | string;
  recordNotes?: string;
}

export default function LabourDetailPage() {
  const { id } = useParams();
  const { labours, updateLabour } = useData();
  const labour = labours.find((l) => l.id === id);
  
  const [records, setRecords] = useState<DailyRecord[]>(() => {
    if (!labour) return [];
    const dailyMap = new Map<string, DailyRecord>();
    
    labour.attendance.forEach(a => {
      dailyMap.set(a.date, {
        id: a.id,
        date: a.date,
        attendance: a.status,
        amountPaid: 0,
        notes: a.notes,
      });
    });
    
    labour.financialRecords.forEach(f => {
      const existing = dailyMap.get(f.date);
      if (existing) {
        existing.amountPaid = f.paid;
        existing.notes = f.notes || existing.notes;
      } else {
        dailyMap.set(f.date, {
          id: f.id,
          date: f.date,
          attendance: '',
          amountPaid: f.paid,
          notes: f.notes,
        });
      }
    });
    
    return Array.from(dailyMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const [isDownloadOptionsOpen, setIsDownloadOptionsOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<'all' | 'month' | 'range'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM format
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DailyRecord | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newRecord, setNewRecord] = useState({
    attendance: '' as 'Present' | 'Absent' | 'Overtime' | 'Half day' | '',
    amountPaid: '',
    notes: '',
  });

  if (!labour) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Labour not found</p>
        <Link to="/admin/labours">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Labours
          </Button>
        </Link>
      </div>
    );
  }

  const totalPaid = records.reduce((sum, r) => sum + r.amountPaid, 0);
  const totalFullDays = records.filter(r => r.attendance === 'Present').length;
  const totalHalfDays = records.filter(r => r.attendance === 'Half day').length;
  const totalOvertime = records.filter(r => r.attendance === 'Overtime').length;
  const totalAbsent = records.filter(r => r.attendance === 'Absent').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalPaidThisMonth = records
    .filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    })
    .reduce((sum, record) => sum + record.amountPaid, 0);

  const calculateDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); // Days in previous month
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    return parts.length > 0 ? `(${parts.join(', ')})` : '';
  };

  const handleAddRecord = () => {
    if (!newRecord.attendance && !newRecord.amountPaid) {
      toast.error('Please enter attendance or payment');
      return;
    }
    
    const record: DailyRecord = {
      id: String(Date.now()),
      date: selectedDate,
      attendance: newRecord.attendance,
      amountPaid: Number(newRecord.amountPaid) || 0,
      notes: newRecord.notes,
    };
    
    const existingIndex = records.findIndex(r => r.date === selectedDate);
    let updated: DailyRecord[];
    if (existingIndex >= 0) {
      updated = [...records];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...records].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    
    setRecords(updated);
    setNewRecord({ attendance: '', amountPaid: '', notes: '' });
    setIsAddModalOpen(false);
    toast.success('Record added successfully!');
  };

  const handleUpdateRecord = () => {
    if (!editingRecord) return;
    
    const updated = records.map(r => 
      r.id === editingRecord.id 
        ? { ...r, date: selectedDate, attendance: newRecord.attendance, amountPaid: Number(newRecord.amountPaid) || 0, notes: newRecord.notes }
        : r
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setRecords(updated);
    setEditingRecord(null);
    setNewRecord({ attendance: '', amountPaid: '', notes: '' });
    toast.success('Record updated successfully!');
  };

  const handleDeleteRecord = () => {
    if (!deletingRecordId) return;
    const updated = records.filter(r => r.id !== deletingRecordId);
    setRecords(updated);
    setDeletingRecordId(null);
    toast.success('Record deleted successfully!');
  };

  const openEditModal = (record: DailyRecord) => {
    setSelectedDate(record.date);
    setNewRecord({
      attendance: record.attendance,
      amountPaid: record.amountPaid ? String(record.amountPaid) : '',
      notes: record.notes,
    });
    setEditingRecord(record);
  };

  const handleDownload = (type: 'all' | 'month' | 'range', month?: string, start?: string, end?: string) => {
    if (!labour) {
      toast.error("Labour data not available for download.");
      return;
    }

    let filteredRecords = records;

    if (type === 'month' && month) {
      const [year, monthIndex] = month.split('-').map(Number);
      const monthStart = startOfMonth(new Date(year, monthIndex - 1));
      const monthEnd = endOfMonth(new Date(year, monthIndex - 1));
      filteredRecords = records.filter(record => {
        const recordDate = parseISO(record.date);
        return isWithinInterval(recordDate, { start: monthStart, end: monthEnd });
      });
    } else if (type === 'range' && start && end) {
      const rangeStart = parseISO(start);
      const rangeEnd = parseISO(end);
      filteredRecords = records.filter(record => {
        const recordDate = parseISO(record.date);
        return isWithinInterval(recordDate, { start: rangeStart, end: rangeEnd });
      });
    }

    const dataToExport: LabourDailyRecordExportData[] = [];
    let columns: { key: keyof LabourDailyRecordExportData; header: string }[] = [];

    // Define all possible columns first
    const allColumns: { key: keyof LabourDailyRecordExportData; header: string }[] = [
      { key: 'name', header: 'Labour Name' },
      { key: 'phone', header: 'Phone' },
      { key: 'address', header: 'Address' },
      { key: 'dateJoined', header: 'Date Joined' },
      { key: 'labourNotes', header: 'Labour Notes' },
      { key: 'status', header: 'Status' },
      { key: 'totalFullDays', header: 'Total Full Days' },
      { key: 'totalHalfDays', header: 'Total Half Days' },
      { key: 'totalAbsent', header: 'Total Absent' },
      { key: 'totalOvertime', header: 'Total Overtime' },
      { key: 'totalPaid', header: 'Total Paid (₹)' },
      { key: 'totalPaidThisMonth', header: 'Paid This Month (₹)' },
      { key: 'recordDate', header: 'Record Date' },
      { key: 'attendance', header: 'Attendance' },
      { key: 'amountPaid', header: 'Amount Paid (₹)' },
      { key: 'recordNotes', header: 'Record Notes' },
    ];

    // Create a summary row
    const summaryRow: LabourDailyRecordExportData = {
      name: labour.name,
      phone: labour.phone,
      address: labour.address || 'N/A',
      dateJoined: new Date(labour.dateJoined).toLocaleDateString('en-IN'),
      labourNotes: labour.notes || 'N/A',
      status: labour.status,
      totalFullDays: totalFullDays,
      totalHalfDays: totalHalfDays,
      totalAbsent: totalAbsent,
      totalOvertime: totalOvertime,
      totalPaid: totalPaid,
      totalPaidThisMonth: totalPaidThisMonth,
      recordDate: undefined,
      attendance: undefined,
      amountPaid: undefined,
      recordNotes: undefined,
    };
    dataToExport.push(summaryRow);

    // Add daily records, only if they exist
    if (filteredRecords.length > 0) {
      filteredRecords.forEach(record => {
        dataToExport.push({
          name: labour.name, // Include name for context in each record
          phone: labour.phone, // Include phone for context in each record
          address: undefined,
          dateJoined: undefined,
          labourNotes: undefined,
          status: undefined,
          totalFullDays: undefined,
          totalHalfDays: undefined,
          totalAbsent: undefined,
          totalOvertime: undefined,
          totalPaid: undefined,
          totalPaidThisMonth: undefined,
          recordDate: new Date(record.date).toLocaleDateString('en-IN'),
          attendance: record.attendance || 'N/A',
          amountPaid: record.amountPaid,
          recordNotes: record.notes || 'N/A',
        });
      });
    } else {
      // If no records, still export labour info and summary metrics
      // No additional row needed as summaryRow already covers this
    }

    columns = allColumns;

    exportToCSV(dataToExport, `labour_${labour.name.replace(/\s/g, '_')}_details_and_records`, columns);
    toast.success('Labour data and daily records exported to CSV!');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/labours"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsDownloadOptionsOpen(true)} className="h-9 w-9">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Labour Info Card */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{labour.name}</h2>
              <Badge variant={labour.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
                {labour.status}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${labour.phone}`} className="text-sm hover:underline">
                    {labour.phone}
                  </a>
                </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(labour.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {labour.address}
                  </a>
                </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Joined: {new Date(labour.dateJoined).toLocaleDateString('en-IN')} {calculateDuration(labour.dateJoined)}</span>
            </div>
            {labour.notes && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{labour.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-success">{totalFullDays}</p>
              <p className="text-xs text-muted-foreground">Full</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-warning">{totalHalfDays}</p>
              <p className="text-xs text-muted-foreground">Half</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-danger">{totalAbsent}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-info">{totalOvertime}</p>
              <p className="text-xs text-muted-foreground">Overtime</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-primary">₹{totalPaid.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">Total Paid</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-primary">₹{totalPaidThisMonth.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">Paid This Month</p>
            </CardContent>
          </Card>
      </div>

      {/* Daily Records */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Daily Records</CardTitle>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {records.length > 0 ? (
              records.map((record) => (
                <div key={record.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">
                      {new Date(record.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      {record.attendance && (
                        <div className="flex items-center gap-1">
                          {record.attendance === 'Present' ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-danger" />
                          )}
                          <span className={`text-sm ${record.attendance === 'Present' ? 'text-success' : 'text-danger'}`}>
                            {record.attendance}
                          </span>
                        </div>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(record)}>
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeletingRecordId(record.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-danger" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {record.amountPaid > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <IndianRupee className="w-3 h-3 text-primary" />
                        <span className="text-primary font-medium">
                          {record.amountPaid.toLocaleString('en-IN')} paid
                        </span>
                      </div>
                    )}
                    {record.notes && (
                      <p className="text-xs text-muted-foreground">{record.notes}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No records yet
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
          setSelectedDate(new Date().toISOString().split('T')[0]);
          setNewRecord({ attendance: '', amountPaid: '', notes: '' });
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit Record' : 'Add Daily Record'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attendance</label>
              <Select
                value={newRecord.attendance}
                onValueChange={(value) => setNewRecord({ ...newRecord, attendance: value as 'Present' | 'Absent' | 'Overtime' | 'Half day' | '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attendance" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Overtime">Overtime</SelectItem>
                <SelectItem value="Half day">Half day</SelectItem>
              </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid (₹)</label>
              <Input
                type="number"
                value={newRecord.amountPaid}
                onChange={(e) => setNewRecord({ ...newRecord, amountPaid: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setEditingRecord(null);
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setNewRecord({ attendance: '', amountPaid: '', notes: '' });
              }} className="flex-1">
                Cancel
              </Button>
              <Button onClick={editingRecord ? handleUpdateRecord : handleAddRecord} className="flex-1">
                {editingRecord ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download Options Dialog */}
      <Dialog open={isDownloadOptionsOpen} onOpenChange={setIsDownloadOptionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Select Download Type</label>
              <Select value={downloadType} onValueChange={(value: 'all' | 'month' | 'range') => setDownloadType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select download type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">Month-wise</SelectItem>
                  <SelectItem value="range">Specific Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {downloadType === 'month' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Month</label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            )}

            {downloadType === 'range' && (
              <div className="flex gap-2">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                handleDownload(downloadType, selectedMonth, startDate, endDate);
                setIsDownloadOptionsOpen(false);
              }}
              className="w-full"
            >
              Download CSV
            </Button>
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
