import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AddResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (resource: { type: string; quantityPurchased: number; price: number; notes: string }) => void;
}

export function AddResourceModal({ open, onOpenChange, onAdd }: AddResourceModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    quantityPurchased: '',
    price: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.quantityPurchased || !formData.price) {
      toast.error('Type, quantity, and price are required');
      return;
    }
    onAdd({
      type: formData.type,
      quantityPurchased: Number(formData.quantityPurchased),
      price: Number(formData.price),
      notes: formData.notes,
    });
    setFormData({ type: '', quantityPurchased: '', price: '', notes: '' });
    onOpenChange(false);
    toast.success('Resource added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resource Type *</label>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g., Cement (Bags)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                type="number"
                value={formData.quantityPurchased}
                onChange={(e) => setFormData({ ...formData, quantityPurchased: e.target.value })}
                placeholder="100"
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
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details..."
              rows={3}
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
