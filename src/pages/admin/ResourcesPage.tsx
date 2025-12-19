import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Download, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { AddResourceModal } from '@/components/admin/AddResourceModal';
import { EditResourceModal } from '@/components/admin/EditResourceModal';
import { exportResources } from '@/lib/exportUtils';
import { toast } from 'sonner';
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

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { resources, addResource, updateResource, deleteResource } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<typeof resources[0] | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  const handleAddResource = (data: { type: string; quantityPurchased: number; price: number; notes: string }) => {
    addResource(data);
    toast.success('Resource added successfully!');
  };

  const handleUpdateResource = (data: { type: string; quantityPurchased: number; used: number; price: number; notes: string }) => {
    if (editingResource) {
      updateResource(editingResource.id, {
        ...data,
        remaining: data.quantityPurchased - data.used,
      });
      setEditingResource(null);
      toast.success('Resource updated successfully!');
    }
  };

  const handleDeleteResource = () => {
    if (deletingResourceId) {
      deleteResource(deletingResourceId);
      setDeletingResourceId(null);
      toast.success('Resource deleted successfully!');
    }
  };

  const handleDownload = () => {
    exportResources(resources);
    toast.success('Resources exported to CSV!');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Resources</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Track inventory</p>
          </div>
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
        {resources.length > 0 ? (
          resources.map((resource) => {
            const usagePercent = (resource.used / resource.quantityPurchased) * 100;
            const isLow = usagePercent > 80;
            return (
              <Card key={resource.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{resource.type}</h3>
                      <p className="text-sm text-muted-foreground">{resource.notes}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        ₹{resource.price.toLocaleString('en-IN')}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingResource(resource)}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeletingResourceId(resource.id)}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
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
          })
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              No resources found
            </CardContent>
          </Card>
        )}
      </div>

      <AddResourceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddResource}
      />

      {editingResource && (
        <EditResourceModal
          open={!!editingResource}
          onOpenChange={(open) => !open && setEditingResource(null)}
          resource={editingResource}
          onUpdate={handleUpdateResource}
        />
      )}

      <AlertDialog open={!!deletingResourceId} onOpenChange={(open) => !open && setDeletingResourceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
