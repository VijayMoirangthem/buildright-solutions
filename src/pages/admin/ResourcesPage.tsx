import { useState } from 'react';
import { resources as initialResources, Resource } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { AddResourceModal } from '@/components/admin/AddResourceModal';
import { toast } from 'sonner';

export default function ResourcesPage() {
  const [resources, setResources] = useState(initialResources);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddResource = (data: { type: string; quantityPurchased: number; price: number; notes: string }) => {
    const newResource: Resource = {
      id: String(resources.length + 1),
      type: data.type,
      quantityPurchased: data.quantityPurchased,
      used: 0,
      remaining: data.quantityPurchased,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: data.price,
      notes: data.notes,
    };
    setResources([newResource, ...resources]);
  };

  const handleDownload = () => {
    toast.success('Resources data exported!');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Track inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleDownload} className="h-9 w-9">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Resource</span>
          </Button>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {resources.map((resource) => {
          const usagePercent = (resource.used / resource.quantityPurchased) * 100;
          const isLow = usagePercent > 80;
          return (
            <Card key={resource.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{resource.type}</h3>
                    <p className="text-sm text-muted-foreground">{resource.notes}</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    ₹{resource.price.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Used: {resource.used.toLocaleString('en-IN')} / {resource.quantityPurchased.toLocaleString('en-IN')}
                    </span>
                    <span className={isLow ? 'text-danger font-medium' : 'text-success'}>
                      {resource.remaining.toLocaleString('en-IN')} left
                    </span>
                  </div>
                  <Progress
                    value={usagePercent}
                    className={`h-2 ${isLow ? '[&>div]:bg-danger' : '[&>div]:bg-primary'}`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddResourceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddResource}
      />
    </div>
  );
}
