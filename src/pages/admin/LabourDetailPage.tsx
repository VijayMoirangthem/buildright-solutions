import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, FileText, CheckCircle, XCircle, Plus, IndianRupee } from 'lucide-react';
import { labours } from '@/data/mockData';
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
import { toast } from 'sonner';

interface DailyRecord {
  id: string;
  date: string;
  attendance: 'Present' | 'Absent' | '';
  amountPaid: number;
  notes: string;
}

export default function LabourDetailPage() {
  const { id } = useParams();
  const labour = labours.find((l) => l.id === id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<DailyRecord[]>(() => {
    if (!labour) return [];
    // Combine attendance and financial records into daily records
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

  const [newRecord, setNewRecord] = useState({
    attendance: '' as 'Present' | 'Absent' | '',
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
  const totalPresent = records.filter(r => r.attendance === 'Present').length;
  const totalAbsent = records.filter(r => r.attendance === 'Absent').length;

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
    
    // Check if record for this date exists
    const existingIndex = records.findIndex(r => r.date === selectedDate);
    if (existingIndex >= 0) {
      const updated = [...records];
      updated[existingIndex] = record;
      setRecords(updated);
    } else {
      setRecords([record, ...records].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
    
    setNewRecord({ attendance: '', amountPaid: '', notes: '' });
    setIsAddModalOpen(false);
    toast.success('Record added successfully!');
  };

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Link
        to="/admin/labours"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

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
              <span>{labour.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{labour.address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Joined: {new Date(labour.dateJoined).toLocaleDateString('en-IN')}</span>
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
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-success">{totalPresent}</p>
            <p className="text-xs text-muted-foreground">Present</p>
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
            <p className="text-lg font-bold text-primary">₹{totalPaid.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">Total Paid</p>
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

      {/* Add Record Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Daily Record</DialogTitle>
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
                onValueChange={(value) => setNewRecord({ ...newRecord, attendance: value as 'Present' | 'Absent' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attendance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
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
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddRecord} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
