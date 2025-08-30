import { useState } from 'react';
import { CRMLayout } from '@/components/CRMLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, UserCheck, Trash2, Edit } from 'lucide-react';
import { AddUserForm } from '@/components/AddUserForm';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';

const roleColors = {
  superadmin: 'bg-red-500/10 text-red-700 dark:text-red-400',
  owner: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  manager: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  supervisor: 'bg-green-500/10 text-green-700 dark:text-green-400',
  marketing: 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
};

const roleLabels = {
  superadmin: 'Superadmin / IT Dev',
  owner: 'Owner',
  manager: 'Manager',
  supervisor: 'Supervisor',
  marketing: 'Marketing'
};

export default function Users() {
  const [showAddUser, setShowAddUser] = useState(false);
  const { users, loading, deleteUser } = useUsers();
  const { profile, hasRole } = useAuth();

  const canManageUsers = hasRole('superadmin') || hasRole('owner') || hasRole('manager');

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage users and their roles</p>
          </div>
          {canManageUsers && (
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Users List
            </CardTitle>
            <CardDescription>
              All users in the system with their roles and divisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Created</TableHead>
                    {canManageUsers && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.display_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role && (
                          <Badge className={roleColors[user.role]}>
                            {roleLabels[user.role]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.division_name || '-'}
                      </TableCell>
                      <TableCell>
                        {user.created_at.toLocaleDateString()}
                      </TableCell>
                      {canManageUsers && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.role === 'superadmin' && !hasRole('superadmin')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AddUserForm 
          open={showAddUser} 
          onOpenChange={setShowAddUser} 
        />
      </div>
    </CRMLayout>
  );
}