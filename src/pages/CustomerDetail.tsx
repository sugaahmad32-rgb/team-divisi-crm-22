import { useParams, useNavigate } from "react-router-dom";
import { CRMLayout } from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { customers, sources, divisions, users, products, interactions } from "@/data/mockData";
import { ArrowLeft, Phone, Mail, MapPin, Building2, DollarSign, Calendar, MessageSquare, User } from "lucide-react";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const customer = customers.find(c => c.id === id);
  
  if (!customer) {
    return (
      <CRMLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </CRMLayout>
    );
  }

  const source = sources.find(s => s.id === customer.source_id);
  const division = divisions.find(d => d.id === customer.division_id);
  const assignedUser = users.find(u => u.id === customer.assigned_to);
  const supervisor = customer.supervisor_id ? users.find(u => u.id === customer.supervisor_id) : null;
  const manager = customer.manager_id ? users.find(u => u.id === customer.manager_id) : null;
  
  const customerProducts = customer.products ? 
    products.filter(p => customer.products!.includes(p.id)) : [];
  
  const customerInteractions = interactions.filter(i => i.customer_id === customer.id);

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
            {customerProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products of Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerProducts.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Rp {(product.price / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
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
                <CardTitle>Interaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {customerInteractions.length > 0 ? (
                  <div className="space-y-4">
                    {customerInteractions.map(interaction => {
                      const user = users.find(u => u.id === interaction.user_id);
                      return (
                        <div key={interaction.id} className="border-l-2 border-border pl-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{interaction.type}</Badge>
                              <Badge variant={interaction.status === 'done' ? 'default' : 
                                            interaction.status === 'overdue' ? 'destructive' : 'secondary'}>
                                {interaction.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(interaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm mb-2">{interaction.notes}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{user?.name}</span>
                            {interaction.due_date && (
                              <>
                                <Calendar className="h-3 w-3 ml-2" />
                                <span>Due: {new Date(interaction.due_date).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No interactions yet</p>
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
                        Rp {(customer.estimation_value / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Interactions</p>
                    <p className="text-lg font-bold">{customerInteractions.length}</p>
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
                  <Badge variant="outline">{source?.name}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Division</p>
                  <Badge variant="outline">{division?.name}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Assigned To</p>
                  <p className="text-sm text-muted-foreground">{assignedUser?.name}</p>
                </div>
                {supervisor && (
                  <div>
                    <p className="text-sm font-medium mb-1">Supervisor</p>
                    <p className="text-sm text-muted-foreground">{supervisor.name}</p>
                  </div>
                )}
                {manager && (
                  <div>
                    <p className="text-sm font-medium mb-1">Manager</p>
                    <p className="text-sm text-muted-foreground">{manager.name}</p>
                  </div>
                )}
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
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Interaction
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
};

export default CustomerDetail;