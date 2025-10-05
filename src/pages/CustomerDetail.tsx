import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { useCustomers, CustomerWithRelations } from "@/hooks/useCustomers";
import { useInteractions, Interaction } from "@/hooks/useInteractions";
import { AddInteractionForm } from "@/components/AddInteractionForm";
import { InteractionCard } from "@/components/InteractionCard";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { ArrowLeft, Phone, Mail, MapPin, Building2, DollarSign, Calendar, MessageSquare, User, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/currency";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [deletingInteraction, setDeletingInteraction] = useState<Interaction | null>(null);
  
  const { fetchCustomer } = useCustomers();
  const { 
    interactions, 
    createInteraction, 
    updateInteraction, 
    deleteInteraction, 
    markAsCompleted 
  } = useInteractions(id);
  
  useEffect(() => {
    const loadCustomer = async () => {
      if (id) {
        console.log('Loading customer with ID:', id);
        const customerData = await fetchCustomer(id);
        setCustomer(customerData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadCustomer();
  }, [id, fetchCustomer]);
  
  if (loading) {
    return (
      <CRMLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CRMLayout>
    );
  }

  if (!customer) {
    return (
      <CRMLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </CRMLayout>
    );
  }

  const handleAddInteraction = async (data: Omit<Interaction, 'id' | 'created_at' | 'updated_at'>) => {
    await createInteraction(data);
  };

  const handleEditInteraction = async (data: Omit<Interaction, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingInteraction) {
      await updateInteraction(editingInteraction.id, data);
      setEditingInteraction(null);
    }
  };

  const handleDeleteInteraction = async () => {
    if (deletingInteraction) {
      await deleteInteraction(deletingInteraction.id);
      setDeletingInteraction(null);
    }
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Customer Details</p>
          </div>
          <StatusBadge status={customer.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {customer.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Company</p>
                          <p className="text-sm text-muted-foreground">{customer.company}</p>
                        </div>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">{customer.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {customer.description && (
                  <div>
                    <p className="text-sm font-medium mb-2">Description</p>
                    <p className="text-sm text-muted-foreground">{customer.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products of Interest */}
            {customer.customer_products && customer.customer_products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products of Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customer.customer_products.map((cp, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{cp.products.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatRupiah(cp.products.price, { compact: true })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interactions Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interaction History</CardTitle>
                  <Button onClick={() => setShowAddInteraction(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interaction
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {interactions.length > 0 ? (
                  <div className="space-y-4">
                    {interactions.map(interaction => (
                      <InteractionCard
                        key={interaction.id}
                        interaction={interaction}
                        onEdit={setEditingInteraction}
                        onDelete={setDeletingInteraction}
                        onMarkCompleted={markAsCompleted}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No interactions yet</p>
                    <Button onClick={() => setShowAddInteraction(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Interaction
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.estimation_value && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Estimation Value</p>
                      <p className="text-lg font-bold text-success">
                        {formatRupiah(customer.estimation_value, { compact: true })}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Interactions</p>
                    <p className="text-lg font-bold">{interactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Source</p>
                  <Badge variant="outline">{customer.sources?.name || 'Unknown'}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowAddInteraction(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Interaction
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddInteractionForm
          open={showAddInteraction}
          onOpenChange={setShowAddInteraction}
          onSubmit={handleAddInteraction}
          customerId={customer.id}
        />

        <AddInteractionForm
          open={!!editingInteraction}
          onOpenChange={(open) => !open && setEditingInteraction(null)}
          onSubmit={handleEditInteraction}
          customerId={customer.id}
          initialData={editingInteraction}
          isEditing={true}
        />

        <DeleteConfirmDialog
          open={!!deletingInteraction}
          onOpenChange={(open) => !open && setDeletingInteraction(null)}
          onConfirm={handleDeleteInteraction}
          title="Delete Interaction"
          description="Are you sure you want to delete this interaction"
          itemName={deletingInteraction?.type}
        />
      </div>
    </CRMLayout>
  );
};

export default CustomerDetail;