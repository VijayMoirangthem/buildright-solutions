import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface AddResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (resource: { 
    type: string; 
    unit: string;
    quantityPurchased: number; 
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

export function AddResourceModal({ open, onOpenChange, onAdd }: AddResourceModalProps) {
  const { projects } = useData();
  const [formData, setFormData] = useState({ 
    type: '', 
    unit: 'Bags',
    quantityPurchased: '', 
    price: '', 
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '', 
    projectId: 'none' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.quantityPurchased || !formData.price) { 
      toast.error('Type, quantity, and price are required'); 
      return; 
    }
    
    onAdd({ 
      type: formData.type, 
      unit: formData.unit,
      quantityPurchased: Number(formData.quantityPurchased), 
      price: Number(formData.price), 
      purchaseDate: formData.purchaseDate,
      notes: formData.notes, 
      projectId: formData.projectId === 'none' ? undefined : formData.projectId 
    });
    
    setFormData({ 
      type: '', 
      unit: 'Bags',
      quantityPurchased: '', 
      price: '', 
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '', 
      projectId: 'none' 
    });
    onOpenChange(false);
    toast.success('Resource added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add New Resource</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resource Type *</label>
            <Input 
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
              placeholder="e.g., Cement, Bricks, Steel Rods" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">Quantity Purchased *</label>
              <Input 
                type="number" 
                value={formData.quantityPurchased} 
                onChange={(e) => setFormData({ ...formData, quantityPurchased: e.target.value })} 
                placeholder="100" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Date *</label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹) *</label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                placeholder="50000" 
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
              placeholder="Brand, supplier, specifications..." 
              rows={2} 
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}