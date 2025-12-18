import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, ChevronRight } from 'lucide-react';
import { clients as initialClients, Client } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddClientModal } from '@/components/admin/AddClientModal';
import { toast } from 'sonner';

export default function ClientsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(initialClients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const handleAddClient = (data: { name: string; phone: string; email: string; address: string; notes: string }) => {
    const newClient: Client = {
      id: String(clients.length + 1),
      ...data,
      dateAdded: new Date().toISOString().split('T')[0],
      financialRecords: [],
      resourceUsage: [],
    };
    setClients([newClient, ...clients]);
  };

  const handleDownload = () => {
    toast.success('Clients data exported!');
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
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer active:bg-muted"
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
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
    </div>
  );
}
