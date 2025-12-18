import { useState, useEffect } from 'react';
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

interface Resource {
  id: string;
  type: string;
  quantityPurchased: number;
  used: number;
  remaining: number;
  price: number;
  notes: string;
}

interface EditResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource;
  onUpdate: (data: { type: string; quantityPurchased: number; used: number; price: number; notes: string }) => void;
}

export function EditResourceModal({ open, onOpenChange, resource, onUpdate }: EditResourceModalProps) {
  const [formData, setFormData] = useState({
    type: resource.type,
    quantityPurchased: resource.quantityPurchased,
    used: resource.used,
    price: resource.price,
    notes: resource.notes,
  });

  useEffect(() => {
    setFormData({
      type: resource.type,
      quantityPurchased: resource.quantityPurchased,
      used: resource.used,
      price: resource.price,
      notes: resource.notes,
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
    onUpdate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
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
              <label className="text-sm font-medium">Qty Purchased *</label>
              <Input
                type="number"
                value={formData.quantityPurchased}
                onChange={(e) => setFormData({ ...formData, quantityPurchased: Number(e.target.value) })}
                placeholder="0"
              />
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
