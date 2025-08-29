import { useState } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Edit, Trash2, Building } from "lucide-react";
import { AddDivisionForm } from "@/components/AddDivisionForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useDivisions, Division } from "@/hooks/useDivisions";

const Divisions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [deletingDivision, setDeletingDivision] = useState<Division | null>(null);
  
  const { divisions, loading, createDivision, updateDivision, deleteDivision } = useDivisions();
  
  const filteredDivisions = divisions.filter(division => 
    division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (division.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddDivision = async (data: { name: string; description?: string }) => {
    await createDivision(data);
  };

  const handleEditDivision = async (data: { name: string; description?: string }) => {
    if (editingDivision) {
      await updateDivision(editingDivision.id, data);
      setEditingDivision(null);
    }
  };

  const handleDeleteDivision = async () => {
    if (deletingDivision) {
      await deleteDivision(deletingDivision.id);
      setDeletingDivision(null);
    }
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Divisions</h1>
            <p className="text-muted-foreground">Manage organization divisions</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4" />
            Add Division
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search divisions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Divisions Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDivisions.map((division) => (
              <Card key={division.id} className="hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        {division.name}
                      </CardTitle>
                      {division.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {division.description}
                        </p>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditingDivision(division)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeletingDivision(division)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(division.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredDivisions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No divisions found matching your search." : "No divisions yet. Create your first division to get started."}
              </p>
              {!searchTerm && (
                <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Division
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <AddDivisionForm 
          open={showAddForm} 
          onOpenChange={setShowAddForm} 
          onSubmit={handleAddDivision} 
        />

        <AddDivisionForm 
          open={!!editingDivision} 
          onOpenChange={(open) => !open && setEditingDivision(null)} 
          onSubmit={handleEditDivision}
          initialData={editingDivision}
          isEditing={true}
        />

        <DeleteConfirmDialog
          open={!!deletingDivision}
          onOpenChange={(open) => !open && setDeletingDivision(null)}
          onConfirm={handleDeleteDivision}
          title="Delete Division"
          description="Are you sure you want to delete this division"
          itemName={deletingDivision?.name}
        />
      </div>
    </CRMLayout>
  );
};

export default Divisions;