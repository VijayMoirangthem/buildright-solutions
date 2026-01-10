import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { Project } from '@/data/mockData';

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function EditProjectModal({ open, onOpenChange, project }: EditProjectModalProps) {
  const { clients, labours, resources, updateProject } = useData();
  
  const [formData, setFormData] = useState({
    name: project.name,
    location: project.location,
    description: project.description,
    status: project.status,
    progress: project.progress,
    startDate: project.startDate,
    endDate: project.endDate,
    budget: String(project.budget),
    notes: project.notes,
    clientIds: [...project.clientIds],
    labourIds: [...project.labourIds],
    resourceIds: [...project.resourceIds],
  });

  useEffect(() => {
    setFormData({
      name: project.name,
      location: project.location,
      description: project.description,
      status: project.status,
      progress: project.progress,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: String(project.budget),
      notes: project.notes,
      clientIds: [...project.clientIds],
      labourIds: [...project.labourIds],
      resourceIds: [...project.resourceIds],
    });
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    updateProject(project.id, {
      ...formData,
      budget: Number(formData.budget) || 0,
    });
    
    onOpenChange(false);
    toast.success('Project updated successfully!');
  };

  const toggleClient = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clientIds: prev.clientIds.includes(clientId)
        ? prev.clientIds.filter(id => id !== clientId)
        : [...prev.clientIds, clientId]
    }));
  };

  const toggleLabour = (labourId: string) => {
    setFormData(prev => ({
      ...prev,
      labourIds: prev.labourIds.includes(labourId)
        ? prev.labourIds.filter(id => id !== labourId)
        : [...prev.labourIds, labourId]
    }));
  };

  const toggleResource = (resourceId: string) => {
    setFormData(prev => ({
      ...prev,
      resourceIds: prev.resourceIds.includes(resourceId)
        ? prev.resourceIds.filter(id => id !== resourceId)
        : [...prev.resourceIds, resourceId]
    }));
  };

  // Get available entities (unassigned or already assigned to this project)
  const availableClients = clients.filter(c => !c.projectId || c.projectId === project.id);
  const availableLabours = labours.filter(l => !l.projectId || l.projectId === project.id);
  const availableResources = resources.filter(r => !r.projectId || r.projectId === project.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details and linked entities.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sharma Residence"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Imphal East"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Progress (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget (₹)</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="1500000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date *</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Link Clients */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Clients</label>
              <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                {availableClients.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No available clients</p>
                ) : (
                  <div className="space-y-2">
                    {availableClients.map((client) => (
                      <div key={client.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-client-${client.id}`}
                          checked={formData.clientIds.includes(client.id)}
                          onCheckedChange={() => toggleClient(client.id)}
                        />
                        <label htmlFor={`edit-client-${client.id}`} className="text-sm cursor-pointer">
                          {client.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Link Labours */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Labours</label>
              <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                {availableLabours.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No available labours</p>
                ) : (
                  <div className="space-y-2">
                    {availableLabours.map((labour) => (
                      <div key={labour.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-labour-${labour.id}`}
                          checked={formData.labourIds.includes(labour.id)}
                          onCheckedChange={() => toggleLabour(labour.id)}
                        />
                        <label htmlFor={`edit-labour-${labour.id}`} className="text-sm cursor-pointer">
                          {labour.name} ({labour.status})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Link Resources */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Resources</label>
              <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                {availableResources.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No available resources</p>
                ) : (
                  <div className="space-y-2">
                    {availableResources.map((resource) => (
                      <div key={resource.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-resource-${resource.id}`}
                          checked={formData.resourceIds.includes(resource.id)}
                          onCheckedChange={() => toggleResource(resource.id)}
                        />
                        <label htmlFor={`edit-resource-${resource.id}`} className="text-sm cursor-pointer">
                          {resource.type} (₹{resource.price.toLocaleString()})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
