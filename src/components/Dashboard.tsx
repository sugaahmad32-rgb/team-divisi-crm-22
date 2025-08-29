import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { customers, interactions, currentUser, getCustomersByUser, getOverdueFollowups, getTodayFollowups } from "@/data/mockData";
import { Users, DollarSign, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import { CustomerStatus } from "@/types/crm";

export function Dashboard() {
  // Filter data based on user role
  const userCustomers = currentUser.role === 'marketing' 
    ? getCustomersByUser(currentUser.id)
    : customers;

  const userOverdueFollowups = currentUser.role === 'marketing' 
    ? getOverdueFollowups(currentUser.id)
    : getOverdueFollowups();

  const userTodayFollowups = currentUser.role === 'marketing'
    ? getTodayFollowups(currentUser.id) 
    : getTodayFollowups();

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

  const recentFollowups = interactions
    .filter(i => currentUser.role !== 'marketing' || i.user_id === currentUser.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
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
          value={userOverdueFollowups.length}
          icon={AlertTriangle}
          variant={userOverdueFollowups.length > 0 ? "danger" : "default"}
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
            {userTodayFollowups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No follow-ups scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {userTodayFollowups.slice(0, 3).map((followup) => {
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
            {recentFollowups.map((interaction) => {
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