import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, Plus, Download } from 'lucide-react';
import { clients } from '@/data/mockData';
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

export default function ClientDetailPage() {
  const { id } = useParams();
  const client = clients.find((c) => c.id === id);

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

  const totalReceived = client.financialRecords
    .filter((r) => r.type === 'Received')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalDue = client.financialRecords
    .filter((r) => r.type === 'Due')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      {/* Client Info Card */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{client.name}</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>{client.address}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Joined: {new Date(client.dateAdded).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-foreground">{client.notes || 'No notes'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Received</p>
                  <p className="text-xl font-bold text-success">
                    ₹{totalReceived.toLocaleString('en-IN')}
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
          </div>
        </CardContent>
      </Card>

      {/* Financial Records */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Financial Records</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.financialRecords.length > 0 ? (
                  client.financialRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        ₹{record.amount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.type === 'Received' ? 'default' : 'destructive'}>
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No financial records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Resource Usage</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Resource Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.resourceUsage.length > 0 ? (
                  client.resourceUsage.map((resource) => (
                    <TableRow key={resource.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {resource.resourceType}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{resource.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">
                        ₹{resource.price.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{resource.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No resource usage records found
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
