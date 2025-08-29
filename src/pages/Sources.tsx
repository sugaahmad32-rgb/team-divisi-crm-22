import { CRMLayout } from "@/components/CRMLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Instagram, Facebook, Users, MessageCircle, Phone, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSources, Source } from "@/hooks/useSources";
import { AddSourceForm } from "@/components/AddSourceForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

const Sources = () => {
  const { sources, loading, createSource, updateSource, deleteSource } = useSources();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [deletingSource, setDeletingSource] = useState<Source | null>(null);

  const handleCreate = async (data: Omit<Source, 'id' | 'created_at' | 'updated_at'>) => {
    await createSource(data);
  };

  const handleEdit = async (data: Omit<Source, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingSource) {
      await updateSource(editingSource.id, data);
      setEditingSource(null);
    }
  };

  const handleDelete = async () => {
    if (deletingSource) {
      await deleteSource(deletingSource.id);
      setDeletingSource(null);
    }
  };

  const getSourceIcon = (sourceName: string) => {
    const icons: Record<string, any> = {
      'Website': Globe,
      'Instagram': Instagram,
      'Facebook Ads': Facebook,
      'Referral': Users,
      'WhatsApp': MessageCircle,
      'Direct Call': Phone,
    };
    return icons[sourceName] || Globe;
  };

  // TODO: Implement customer count from database
  const getCustomerCount = (sourceId: string) => {
    return 0; // Placeholder until we implement customer fetching
  };

  const getSourceColor = (sourceName: string) => {
    const colors: Record<string, string> = {
      'Website': 'text-blue-600',
      'Instagram': 'text-pink-600',
      'Facebook Ads': 'text-blue-700',
      'Referral': 'text-green-600',
      'WhatsApp': 'text-green-500',
      'Direct Call': 'text-purple-600',
    };
    return colors[sourceName] || 'text-gray-600';
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Sources</h1>
            <p className="text-muted-foreground">Manage your lead sources</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((source) => {
              const IconComponent = getSourceIcon(source.name);
              const customerCount = getCustomerCount(source.id);
              
              return (
                <Card key={source.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${getSourceColor(source.name)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {customerCount} customers
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {source.description || "No description available"}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => setEditingSource(source)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => setDeletingSource(source)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <AddSourceForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onSubmit={handleCreate}
        />

        <AddSourceForm
          open={!!editingSource}
          onOpenChange={(open) => !open && setEditingSource(null)}
          onSubmit={handleEdit}
          initialData={editingSource}
          isEditing={true}
        />

        <DeleteConfirmDialog
          open={!!deletingSource}
          onOpenChange={(open) => !open && setDeletingSource(null)}
          onConfirm={handleDelete}
          title="Delete Source"
          description="Are you sure you want to delete this source"
          itemName={deletingSource?.name}
        />
      </div>
    </CRMLayout>
  );
};

export default Sources;