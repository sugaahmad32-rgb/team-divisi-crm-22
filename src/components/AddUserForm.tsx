import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateUserData, useUsers } from '@/hooks/useUsers';
import { useDivisions } from '@/hooks/useDivisions';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface AddUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleLabels: Record<UserRole, string> = {
  superadmin: 'Superadmin / IT Dev',
  owner: 'Owner',
  manager: 'Manager',
  supervisor: 'Supervisor',
  marketing: 'Marketing'
};

export function AddUserForm({ open, onOpenChange }: AddUserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    display_name: '',
    role: 'marketing',
    division_id: undefined,
  });

  const { createUser } = useUsers();
  const { divisions } = useDivisions();
  const { profile, canManageRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canManageRole(formData.role)) {
      return;
    }

    await createUser(formData);
    setFormData({
      email: '',
      password: '',
      display_name: '',
      role: 'marketing',
      division_id: undefined,
    });
    onOpenChange(false);
  };

  const getAvailableRoles = (): UserRole[] => {
    if (!profile?.role) return [];
    
    const roleHierarchy: Record<UserRole, UserRole[]> = {
      superadmin: ['owner', 'manager', 'supervisor', 'marketing'],
      owner: ['manager', 'supervisor', 'marketing'],
      manager: ['supervisor', 'marketing'],
      supervisor: [],
      marketing: []
    };
    
    return roleHierarchy[profile.role] || [];
  };

  const availableRoles = getAvailableRoles();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Division (Optional)</Label>
            <Select
              value={formData.division_id || "none"}
              onValueChange={(value) => 
                setFormData({ ...formData, division_id: value === "none" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Division</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}