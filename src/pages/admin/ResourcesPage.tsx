import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useStorage } from '@/contexts/StorageContext';
import { BackButton } from '@/components/admin/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Download, Pencil, Trash2, Calendar, Paperclip, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { AddResourceModal } from '@/components/admin/AddResourceModal';
import { EditResourceModal } from '@/components/admin/EditResourceModal';
import { exportResources } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const { resources, clients, addResource, updateResource, deleteResource } = useData();
  const { files, formatBytes } = useStorage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<typeof resources[0] | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

  // Get files linked to resources
  const getResourceFiles = (resourceId: string) => {
    return files.filter(f => f.linkedTo?.type === 'resource' && f.linkedTo.id === resourceId);
  };

  // Get client records that used this resource type (from both financialRecords and resourceUsage)
  const getResourceUsageRecords = (resourceType: string) => {
    const records: Array<{
      clientId: string;
      clientName: string;
      recordId: string;
      date: string;
      quantity: number;
      amount: number;
      notes: string;
      attachmentIds: string[];
      source: 'financial' | 'usage';
    }> = [];

    clients.forEach(client => {
      // Check financialRecords with resourceType
      client.financialRecords?.forEach(record => {
        if (record.resourceType === resourceType && record.resourceQuantity) {
          records.push({
            clientId: client.id,
            clientName: client.name,
            recordId: record.id,
            date: record.date,
            quantity: record.resourceQuantity,
            amount: record.amount,
            notes: record.notes,
            attachmentIds: record.attachments || [],
            source: 'financial',
          });
        }
      });

      // Check resourceUsage array
      client.resourceUsage?.forEach(usage => {
        if (usage.resourceType === resourceType) {
          records.push({
            clientId: client.id,
            clientName: client.name,
            recordId: usage.id,
            date: client.dateAdded, // Use client's date as reference
            quantity: usage.quantity,
            amount: usage.price,
            notes: usage.notes,
            attachmentIds: [],
            source: 'usage',
          });
        }
      });
    });

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Get files linked to a specific record
  const getRecordFiles = (attachmentIds: string[]) => {
    return files.filter(f => attachmentIds.includes(f.id));
  };

  const toggleExpanded = (resourceId: string) => {
    setExpandedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const handleAddResource = (data: { 
    type: string; 
    unit: string;
    quantityPurchased: number; 
    price: number; 
    purchaseDate: string;
    notes: string;
    projectId?: string;
  }) => {
    addResource(data);
    toast.success('Resource added successfully!');
  };

  const handleUpdateResource = (data: { 
    type: string; 
    unit: string;
    quantityPurchased: number; 
    used: number; 
    price: number; 
    purchaseDate: string;
    notes: string;
    projectId?: string;
  }) => {
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
          <BackButton />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Resources</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Track inventory & usage</p>
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
      <Card className="shadow-card">
        <CardHeader className="border-b border-border py-3 px-4">
          <CardTitle className="text-base">All Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {resources.length > 0 ? (
              resources.map((resource) => {
                const usagePercent = (resource.used / resource.quantityPurchased) * 100;
                const isLow = usagePercent > 80;
                const linkedFiles = getResourceFiles(resource.id);
                const usageRecords = getResourceUsageRecords(resource.type);
                const isExpanded = expandedResources.has(resource.id);
                
                return (
                  <Collapsible key={resource.id} open={isExpanded} onOpenChange={() => toggleExpanded(resource.id)}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{resource.type}</h3>
                            {usageRecords.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {usageRecords.length} usage record{usageRecords.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              Purchased: {new Date(resource.purchaseDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          {resource.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{resource.notes}</p>
                          )}
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
                            Used: {resource.used.toLocaleString('en-IN')} {resource.unit} / {resource.quantityPurchased.toLocaleString('en-IN')} {resource.unit}
                          </span>
                          <span className={isLow ? 'text-danger font-medium' : 'text-success'}>
                            {resource.remaining.toLocaleString('en-IN')} {resource.unit} left
                          </span>
                        </div>
                        <Progress
                          value={usagePercent}
                          className={`h-2 ${isLow ? '[&>div]:bg-danger' : '[&>div]:bg-primary'}`}
                        />
                      </div>

                      {/* Linked Files */}
                      {linkedFiles.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Linked Files:</p>
                          <div className="flex flex-wrap gap-2">
                            {linkedFiles.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                              >
                                <Paperclip className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{file.name}</span>
                                <span className="text-muted-foreground">({formatBytes(file.size)})</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={() => window.open(file.url, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Usage Records Toggle */}
                      {usageRecords.length > 0 && (
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="mt-3 w-full justify-center text-primary">
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Hide Usage History
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                View Usage History ({usageRecords.length})
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </div>

                    {/* Usage Records Expandable Section */}
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                          <h4 className="text-sm font-medium text-foreground">Usage History from Client Records</h4>
                          {usageRecords.map((record) => {
                            const recordFiles = getRecordFiles(record.attachmentIds);
                            return (
                              <div key={`${record.source}-${record.recordId}`} className="bg-background rounded-md p-3 border border-border">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-foreground">{record.clientName}</p>
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {record.source === 'financial' ? 'Financial Record' : 'Resource Usage'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(record.date).toLocaleDateString('en-IN')}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-primary">
                                      {record.quantity.toLocaleString('en-IN')} {resource.unit} used
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      ₹{record.amount.toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                </div>
                                {record.notes && (
                                  <p className="text-xs text-muted-foreground mt-2">{record.notes}</p>
                                )}
                                {/* Show attached files from this record */}
                                {recordFiles.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {recordFiles.map((file) => (
                                      <Button
                                        key={file.id}
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs px-2"
                                        onClick={() => window.open(file.url, '_blank')}
                                      >
                                        <FileText className="w-3 h-3 mr-1" />
                                        {file.name}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No resources found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
