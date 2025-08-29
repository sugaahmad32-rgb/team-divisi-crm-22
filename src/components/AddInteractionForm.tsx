import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Interaction } from "@/hooks/useInteractions";

interface AddInteractionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Interaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  customerId: string;
  initialData?: Interaction | null;
  isEditing?: boolean;
}

export const AddInteractionForm = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  customerId,
  initialData,
  isEditing = false 
}: AddInteractionFormProps) => {
  const [formData, setFormData] = useState({
    customer_id: customerId,
    type: (initialData?.type || 'call') as Interaction['type'],
    notes: initialData?.notes || "",
    status: (initialData?.status || 'pending') as Interaction['status'],
    due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : "",
    completed_at: initialData?.completed_at || undefined,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submissionData = {
        ...formData,
        customer_id: customerId,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
      };
      
      await onSubmit(submissionData);
      onOpenChange(false);
      setFormData({
        customer_id: customerId,
        type: 'call',
        notes: "",
        status: 'pending',
        due_date: "",
        completed_at: undefined,
      });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Interaction" : "Add New Interaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Interaction['type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="followup">Follow Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Interaction['status'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              required
              placeholder="Enter interaction notes..."
            />
          </div>
          
          <div>
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Interaction" : "Add Interaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};