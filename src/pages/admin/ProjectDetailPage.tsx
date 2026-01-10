import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Users, HardHat, Package, Calendar, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BackButton } from '@/components/admin/BackButton';
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
import { useData } from '@/contexts/DataContext';
import { EditProjectModal } from '@/components/admin/EditProjectModal';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, clients, labours, resources, deleteProject } = useData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">Project not found</h2>
        <Button onClick={() => navigate('/admin/projects')}>Back to Projects</Button>
      </div>
    );
  }

  // Fix: Use both array-based linking AND projectId-based linking for bidirectional sync
  const linkedClients = clients.filter(c => 
    project.clientIds.includes(c.id) || c.projectId === project.id
  );
  const linkedLabours = labours.filter(l => 
    project.labourIds.includes(l.id) || l.projectId === project.id
  );
  const linkedResources = resources.filter(r => 
    project.resourceIds.includes(r.id) || r.projectId === project.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-primary/10 text-primary';
      case 'Completed': return 'bg-success/10 text-success';
      case 'Planning': return 'bg-warning/10 text-warning';
      case 'On Hold': return 'bg-danger/10 text-danger';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = () => {
    deleteProject(project.id);
    toast.success('Project deleted successfully');
    navigate('/admin/projects');
  };

  const totalResourceCost = linkedResources.reduce((sum, r) => sum + r.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {project.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-danger hover:text-danger" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              <span className="text-sm text-muted-foreground">{project.progress}% Complete</span>
            </div>
            <Progress value={project.progress} className="h-3" />
            
            <p className="text-muted-foreground">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-medium text-foreground">
                    ₹{project.budget.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Resource Cost</p>
                  <p className="font-medium text-foreground">
                    ₹{totalResourceCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {project.notes && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{project.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/clients')}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{linkedClients.length}</p>
                <p className="text-sm text-muted-foreground">Clients</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/labours')}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <HardHat className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{linkedLabours.length}</p>
                <p className="text-sm text-muted-foreground">Labours</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/resources')}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{linkedResources.length}</p>
                <p className="text-sm text-muted-foreground">Resources</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Linked Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Linked Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {linkedClients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No clients linked</p>
            ) : (
              <div className="space-y-3">
                {linkedClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                  >
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Labours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HardHat className="w-5 h-5 text-success" />
              Linked Labours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {linkedLabours.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No labours linked</p>
            ) : (
              <div className="space-y-3">
                {linkedLabours.map((labour) => (
                  <div
                    key={labour.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/labours/${labour.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{labour.name}</p>
                      <Badge variant={labour.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                        {labour.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{labour.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-warning" />
              Linked Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {linkedResources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No resources linked</p>
            ) : (
              <div className="space-y-3">
                {linkedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-3 rounded-lg bg-muted/50"
                  >
                    <p className="font-medium text-foreground">{resource.type}</p>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Used: {resource.used}/{resource.quantityPurchased}</span>
                      <span>₹{resource.price.toLocaleString()}</span>
                    </div>
                    <Progress value={(resource.used / resource.quantityPurchased) * 100} className="h-1.5 mt-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <EditProjectModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={project}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This will unlink all associated clients, labours, and resources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
