import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Users, DollarSign, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import { CustomerStatus } from "@/types/crm";
import { useCustomers } from "@/hooks/useCustomers";
import { useInteractions } from "@/hooks/useInteractions";
import { useAuth } from "@/contexts/AuthContext";

export function Dashboard() {
  const { customers, loading: customersLoading } = useCustomers();
  const { interactions, loading: interactionsLoading } = useInteractions();
  const { profile } = useAuth();

  if (customersLoading || interactionsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter data based on user role - for marketing, only show their assigned customers
  const userCustomers = profile?.role === 'marketing' 
    ? customers.filter(c => c.assigned_to_user_id === profile.user_id)
    : customers;

  const userInteractions = profile?.role === 'marketing'
    ? interactions.filter(i => i.user_id === profile.user_id)
    : interactions;

  // Calculate metrics
  const totalCustomers = userCustomers.length;
  const pipelineValue = userCustomers.reduce((sum, customer) => sum + (customer.estimation_value || 0), 0);
  
  const statusBreakdown = userCustomers.reduce((acc, customer) => {
    acc[customer.status] = (acc[customer.status] || 0) + 1;
    return acc;
  }, {} as Record<CustomerStatus, number>);

  const conversionRate = userCustomers.length > 0 
    ? ((statusBreakdown.deal || 0) / userCustomers.length * 100) 
    : 0;

  // Get today's date for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayFollowups = userInteractions.filter(i => {
    if (!i.due_date) return false;
    const dueDate = new Date(i.due_date);
    return dueDate >= today && dueDate < tomorrow && i.status === 'pending';
  });

  const overdueFollowups = userInteractions.filter(i => {
    if (!i.due_date) return false;
    const dueDate = new Date(i.due_date);
    return dueDate < today && i.status === 'pending';
  });

  const recentInteractions = userInteractions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.display_name}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          trend={{ value: 12, label: "from last month" }}
        />
        <MetricCard
          title="Pipeline Value"
          value={pipelineValue}
          icon={DollarSign}
          variant="success"
          trend={{ value: 8, label: "from last month" }}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: 2.1, label: "from last month" }}
        />
        <MetricCard
          title="Overdue Follow-ups"
          value={overdueFollowups.length}
          icon={AlertTriangle}
          variant={overdueFollowups.length > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Customer Status Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={status as CustomerStatus} />
                  <span className="text-sm font-medium capitalize">{status}</span>
                </div>
                <span className="text-sm font-bold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayFollowups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No follow-ups scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayFollowups.slice(0, 3).map((followup) => {
                  const customer = customers.find(c => c.id === followup.customer_id);
                  return (
                    <div key={followup.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{customer?.name}</p>
                        <p className="text-xs text-muted-foreground">{followup.notes}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {followup.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInteractions.map((interaction) => {
              const customer = customers.find(c => c.id === interaction.customer_id);
              return (
                <div key={interaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{customer?.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {interaction.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          interaction.status === 'done' ? 'bg-success/10 text-success' :
                          interaction.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}
                      >
                        {interaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{interaction.notes}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(interaction.created_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}