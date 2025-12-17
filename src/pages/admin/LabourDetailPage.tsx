import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { labours } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function LabourDetailPage() {
  const { id } = useParams();
  const labour = labours.find((l) => l.id === id);

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

  const totalAdvance = labour.financialRecords.reduce((sum, r) => sum + r.advance, 0);
  const totalPaid = labour.financialRecords.reduce((sum, r) => sum + r.paid, 0);
  const totalDue = labour.financialRecords.reduce((sum, r) => sum + r.due, 0);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/labours"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Labours
      </Link>

      {/* Labour Info Card */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Labour Information</CardTitle>
            <Badge variant={labour.status === 'Active' ? 'default' : 'secondary'}>
              {labour.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{labour.name}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{labour.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>{labour.address}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Joined: {new Date(labour.dateJoined).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-foreground">{labour.notes || 'No notes'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-warning/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Advance</p>
                <p className="text-xl font-bold text-warning">
                  ₹{totalAdvance.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-success">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-4 bg-danger/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Due</p>
                <p className="text-xl font-bold text-danger">
                  ₹{totalDue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labour.attendance.length > 0 ? (
                  labour.attendance.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {record.status === 'Present' ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-danger" />
                          )}
                          <span className={record.status === 'Present' ? 'text-success' : 'text-danger'}>
                            {record.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Records */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Financial Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Advance</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labour.financialRecords.length > 0 ? (
                  labour.financialRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell className="text-warning">
                        ₹{record.advance.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-success">
                        ₹{record.paid.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-danger">
                        ₹{record.due.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No financial records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
