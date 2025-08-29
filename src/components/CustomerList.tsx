import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { customers, sources, divisions, currentUser, getCustomersByUser } from "@/data/mockData";
import { Search, Plus, Phone, Mail, Building2, DollarSign } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddCustomerForm } from "./AddCustomerForm";
import { toast } from "@/hooks/use-toast";

export function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  
  // Filter customers based on user role
  const userCustomers = currentUser.role === 'marketing' 
    ? getCustomersByUser(currentUser.id)
    : customers;

  const filteredCustomers = userCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceName = (sourceId: string) => {
    return sources.find(s => s.id === sourceId)?.name || 'Unknown';
  };

  const getDivisionName = (divisionId: string) => {
    return divisions.find(d => d.id === divisionId)?.name || 'Unknown';
  };

  const handleAddCustomer = (data: any) => {
    console.log('New customer:', data);
    toast({
      title: "Customer added successfully",
      description: `${data.name} has been added to your customer list.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card 
            key={customer.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  {customer.company && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {customer.company}
                    </p>
                  )}
                </div>
                <StatusBadge status={customer.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              </div>

              {/* Estimation Value */}
              {customer.estimation_value && (
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <DollarSign className="h-3 w-3" />
                  <span>Rp {(customer.estimation_value / 1000000).toFixed(1)}M</span>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {getSourceName(customer.source_id)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getDivisionName(customer.division_id)}
                </Badge>
              </div>

              {/* Description */}
              {customer.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {customer.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Added {new Date(customer.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Mail className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No customers found matching your search.</p>
          </CardContent>
        </Card>
      )}

      <AddCustomerForm 
        open={showAddForm} 
        onOpenChange={setShowAddForm} 
        onSubmit={handleAddCustomer} 
      />
    </div>
  );
}