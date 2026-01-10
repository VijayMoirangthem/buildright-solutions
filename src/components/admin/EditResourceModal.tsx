import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface Resource {
  id: string;
  type: string;
  unit: string;
  quantityPurchased: number;
  used: number;
  remaining: number;
  price: number;
  purchaseDate: string;
  notes: string;
  projectId?: string;
}

interface EditResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource;
  onUpdate: (data: { 
    type: string; 
    unit: string;
    quantityPurchased: number; 
    used: number; 
    price: number; 
    purchaseDate: string;
    notes: string;
    projectId?: string;
  }) => void;
}

const COMMON_UNITS = [
  'Bags',
  'Tons',
  'Cubic Meters',
  'Cubic Feet',
  'Units',
  'Pieces',
  'Liters',
  'Kilograms',
  'Square Feet',
  'Square Meters',
  'Meters',
  'Feet',
];

export function EditResourceModal({ open, onOpenChange, resource, onUpdate }: EditResourceModalProps) {
  const { projects } = useData();
  const [formData, setFormData] = useState({
    type: resource.type,
    unit: resource.unit || 'Bags',
    quantityPurchased: resource.quantityPurchased,
    used: resource.used,
    price: resource.price,
    purchaseDate: resource.purchaseDate || new Date().toISOString().split('T')[0],
    notes: resource.notes,
    projectId: resource.projectId || 'none',
  });

  useEffect(() => {
    setFormData({
      type: resource.type,
      unit: resource.unit || 'Bags',
      quantityPurchased: resource.quantityPurchased,
      used: resource.used,
      price: resource.price,
      purchaseDate: resource.purchaseDate || new Date().toISOString().split('T')[0],
      notes: resource.notes,
      projectId: resource.projectId || 'none',
    });
  }, [resource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || formData.quantityPurchased <= 0) {
      toast.error('Type and quantity are required');
      return;
    }
    if (formData.used > formData.quantityPurchased) {
      toast.error('Used cannot be more than purchased');
      return;
    }
    onUpdate({
      ...formData,
      projectId: formData.projectId === 'none' ? undefined : formData.projectId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>Update resource details and inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resource Type *</label>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g., Cement, Bricks, Steel"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit of Measurement *</label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qty Purchased *</label>
              <Input
                type="number"
                value={formData.quantityPurchased}
                onChange={(e) => setFormData({ ...formData, quantityPurchased: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Used</label>
            <Input
              type="number"
              value={formData.used}
              onChange={(e) => setFormData({ ...formData, used: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Date *</label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Select 
              value={formData.projectId} 
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any notes..."
              rows={2}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}