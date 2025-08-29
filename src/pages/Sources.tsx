import { CRMLayout } from "@/components/CRMLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Instagram, Facebook, Users, MessageCircle, Phone } from "lucide-react";
import { sources, customers } from "@/data/mockData";
import { useState } from "react";
import { AddCustomerForm } from "@/components/AddCustomerForm";

const Sources = () => {
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleAddCustomerWithSource = (sourceId: string) => {
    setSelectedSource(sourceId);
    setShowAddCustomerForm(true);
  };

  const handleCustomerSubmit = (data: any) => {
    // Handle customer creation with selected source
    console.log('Creating customer with source:', { ...data, source_id: selectedSource || data.source_id });
    setShowAddCustomerForm(false);
    setSelectedSource(null);
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

  const getCustomerCount = (sourceId: string) => {
    return customers.filter(customer => customer.source_id === sourceId).length;
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
            <p className="text-muted-foreground">Track where your customers come from and add new leads</p>
          </div>
          <Button onClick={() => setShowAddCustomerForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

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
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {customerCount} customers
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {customerCount === 0 && "No customers from this source yet"}
                    {customerCount === 1 && "1 customer acquired"}
                    {customerCount > 1 && `${customerCount} customers acquired`}
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleAddCustomerWithSource(source.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer from {source.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <AddCustomerForm
          open={showAddCustomerForm}
          onOpenChange={setShowAddCustomerForm}
          onSubmit={handleCustomerSubmit}
        />
      </div>
    </CRMLayout>
  );
};

export default Sources;