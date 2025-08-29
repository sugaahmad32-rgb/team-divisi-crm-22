import { CRMLayout } from "@/components/CRMLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, DollarSign, Archive } from "lucide-react";
import { products } from "@/data/mockData";
import { useState } from "react";
import { AddCustomerForm } from "@/components/AddCustomerForm";
import { Customer } from "@/types/crm";

const Products = () => {
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleAddCustomerWithProduct = (productId: string) => {
    setSelectedProduct(productId);
    setShowAddCustomerForm(true);
  };

  const handleCustomerSubmit = (data: any) => {
    // Handle customer creation with selected product
    console.log('Creating customer with product:', { ...data, products: selectedProduct ? [selectedProduct] : data.products });
    setShowAddCustomerForm(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price: number) => {
    return (price / 1000000).toFixed(1) + 'M';
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog and connect with customers</p>
          </div>
          <Button onClick={() => setShowAddCustomerForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </div>
                  <Badge variant={product.stock > 5 ? "default" : "destructive"}>
                    {product.stock} in stock
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{product.description}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Rp {formatPrice(product.price)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Archive className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{product.stock} units</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleAddCustomerWithProduct(product.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer for this Product
                </Button>
              </CardContent>
            </Card>
          ))}
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

export default Products;