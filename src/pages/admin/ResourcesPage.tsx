import { resources } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground">Track construction materials and inventory</p>
        </div>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Resources Table */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Inventory Status</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Resource Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Purchased</TableHead>
                  <TableHead className="hidden md:table-cell">Used</TableHead>
                  <TableHead className="hidden md:table-cell">Remaining</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="hidden lg:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => {
                  const usagePercent = (resource.used / resource.quantityPurchased) * 100;
                  const isLow = usagePercent > 80;
                  return (
                    <TableRow key={resource.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{resource.type}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {resource.remaining} remaining
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {resource.quantityPurchased.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {resource.used.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={isLow ? 'text-danger font-medium' : 'text-success'}>
                          {resource.remaining.toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <div className="space-y-1">
                          <Progress
                            value={usagePercent}
                            className={`h-2 ${isLow ? '[&>div]:bg-danger' : '[&>div]:bg-primary'}`}
                          />
                          <p className="text-xs text-muted-foreground">
                            {usagePercent.toFixed(0)}% used
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        <div>
                          <p>{new Date(resource.startDate).toLocaleDateString('en-IN')}</p>
                          <p>to {new Date(resource.endDate).toLocaleDateString('en-IN')}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        ₹{resource.price.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Notes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="shadow-card hover:shadow-card-hover transition-all">
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground mb-2">{resource.type}</h3>
              <p className="text-sm text-muted-foreground">{resource.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
