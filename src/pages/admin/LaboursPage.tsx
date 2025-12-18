import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddLabourModal } from '@/components/admin/AddLabourModal';
import { EditLabourModal } from '@/components/admin/EditLabourModal';
import { exportLabours } from '@/lib/exportUtils';
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

export default function LaboursPage() {
  const navigate = useNavigate();
  const { labours, addLabour, updateLabour, deleteLabour } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<typeof labours[0] | null>(null);
  const [deletingLabourId, setDeletingLabourId] = useState<string | null>(null);

  const filteredLabours = labours.filter(
    (labour) =>
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.phone.includes(searchTerm)
  );

  const handleAddLabour = (data: { name: string; phone: string; address: string; notes: string; status: 'Active' | 'Inactive' }) => {
    addLabour(data);
    toast.success('Labour added successfully!');
  };

  const handleUpdateLabour = (data: { name: string; phone: string; address: string; notes: string; status: 'Active' | 'Inactive' }) => {
    if (editingLabour) {
      updateLabour(editingLabour.id, data);
      setEditingLabour(null);
      toast.success('Labour updated successfully!');
    }
  };

  const handleDeleteLabour = () => {
    if (deletingLabourId) {
      deleteLabour(deletingLabourId);
      setDeletingLabourId(null);
      toast.success('Labour deleted successfully!');
    }
  };

  const handleDownload = () => {
    exportLabours(labours);
    toast.success('Labours exported to CSV!');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Labours</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Manage your workforce</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleDownload} className="h-9 w-9">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Labour</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Labours List */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border py-3 px-4">
          <CardTitle className="text-base">All Labours ({filteredLabours.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLabours.length > 0 ? (
              filteredLabours.map((labour) => (
                <div
                  key={labour.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/admin/labours/${labour.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{labour.name}</p>
                      <Badge variant={labour.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                        {labour.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{labour.phone}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLabour(labour);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingLabourId(labour.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </Button>
                    <ChevronRight 
                      className="w-5 h-5 text-muted-foreground shrink-0 cursor-pointer" 
                      onClick={() => navigate(`/admin/labours/${labour.id}`)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No labours found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddLabourModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddLabour}
      />

      {editingLabour && (
        <EditLabourModal
          open={!!editingLabour}
          onOpenChange={(open) => !open && setEditingLabour(null)}
          labour={editingLabour}
          onUpdate={handleUpdateLabour}
        />
      )}

      <AlertDialog open={!!deletingLabourId} onOpenChange={(open) => !open && setDeletingLabourId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Labour</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this labour? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLabour} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
