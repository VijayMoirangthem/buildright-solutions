import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddClientModal } from '@/components/admin/AddClientModal';
import { EditClientModal } from '@/components/admin/EditClientModal';
import { exportClients } from '@/lib/exportUtils';
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

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, addClient, updateClient, deleteClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<typeof clients[0] | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const handleAddClient = (data: { name: string; phone: string; email: string; address: string; notes: string }) => {
    addClient(data);
    toast.success('Client added successfully!');
  };

  const handleUpdateClient = (data: { name: string; phone: string; email: string; address: string; notes: string }) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
      setEditingClient(null);
      toast.success('Client updated successfully!');
    }
  };

  const handleDeleteClient = () => {
    if (deletingClientId) {
      deleteClient(deletingClientId);
      setDeletingClientId(null);
      toast.success('Client deleted successfully!');
    }
  };

  const handleDownload = () => {
    exportClients(clients);
    toast.success('Clients exported to CSV!');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Manage your clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleDownload} className="h-9 w-9">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Client</span>
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

      {/* Clients List */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border py-3 px-4">
          <CardTitle className="text-base">All Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                  >
                    <p className="font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingClient(client);
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
                        setDeletingClientId(client.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </Button>
                    <ChevronRight 
                      className="w-5 h-5 text-muted-foreground shrink-0 cursor-pointer" 
                      onClick={() => navigate(`/admin/clients/${client.id}`)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No clients found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddClientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddClient}
      />

      {editingClient && (
        <EditClientModal
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          client={editingClient}
          onUpdate={handleUpdateClient}
        />
      )}

      <AlertDialog open={!!deletingClientId} onOpenChange={(open) => !open && setDeletingClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
