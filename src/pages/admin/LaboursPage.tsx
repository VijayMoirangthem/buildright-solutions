import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Plus, Filter } from 'lucide-react';
import { labours } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function LaboursPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLabours = labours.filter(
    (labour) =>
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Labours</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Add Labour
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Labours Table */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">
            All Labours ({filteredLabours.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Date Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabours.length > 0 ? (
                  filteredLabours.map((labour) => (
                    <TableRow key={labour.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">
                        {labour.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {labour.phone}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(labour.dateJoined).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={labour.status === 'Active' ? 'default' : 'secondary'}>
                          {labour.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/labours/${labour.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No labours found
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
