import { useState, useEffect } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, DollarSign, Target, Calendar, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AnalyticsData {
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalValue: number;
  conversionRate: number;
  customersByStatus: Array<{ name: string; value: number; color: string }>;
  customersByMonth: Array<{ month: string; customers: number; value: number }>;
  topSources: Array<{ name: string; customers: number }>;
  interactionMetrics: Array<{ type: string; count: number }>;
}

export default function Analytics() {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState("30");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    totalValue: 0,
    conversionRate: 0,
    customersByStatus: [],
    customersByMonth: [],
    topSources: [],
    interactionMetrics: []
  });
  const [loading, setLoading] = useState(true);

  const statusColors = {
    new: "hsl(var(--status-new))",
    cold: "hsl(var(--status-cold))",
    warm: "hsl(var(--status-warm))",
    hot: "hsl(var(--status-hot))",
    deal: "hsl(var(--status-deal))"
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      // Get customers data
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select(`
          id,
          status,
          estimation_value,
          created_at,
          source_id,
          sources(name)
        `)
        .gte('created_at', startDate.toISOString());

      if (customersError) throw customersError;

      // Get interactions data
      const { data: interactions, error: interactionsError } = await supabase
        .from('interactions')
        .select('type, status, created_at')
        .gte('created_at', startDate.toISOString());

      if (interactionsError) throw interactionsError;

      // Process data
      const totalCustomers = customers?.length || 0;
      const totalValue = customers?.reduce((sum, c) => sum + (c.estimation_value || 0), 0) || 0;
      
      // Calculate conversion rate (deals / total customers)
      const dealCustomers = customers?.filter(c => c.status === 'deal').length || 0;
      const conversionRate = totalCustomers > 0 ? (dealCustomers / totalCustomers) * 100 : 0;

      // New customers this month
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      const newCustomersThisMonth = customers?.filter(c => 
        new Date(c.created_at) >= thisMonthStart
      ).length || 0;

      // Customers by status
      const statusGroups = customers?.reduce((acc, customer) => {
        const status = customer.status || 'new';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const customersByStatus = Object.entries(statusGroups).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: statusColors[status as keyof typeof statusColors] || statusColors.new
      }));

      // Customers by month (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthCustomers = customers?.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }) || [];

        monthlyData.push({
          month: monthDate.toLocaleDateString('id-ID', { month: 'short' }),
          customers: monthCustomers.length,
          value: monthCustomers.reduce((sum, c) => sum + (c.estimation_value || 0), 0)
        });
      }

      // Top sources
      const sourceGroups = customers?.reduce((acc, customer) => {
        const sourceName = customer.sources?.name || 'Unknown';
        acc[sourceName] = (acc[sourceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topSources = Object.entries(sourceGroups)
        .map(([name, customers]) => ({ name, customers }))
        .sort((a, b) => b.customers - a.customers)
        .slice(0, 5);

      // Interaction metrics
      const interactionGroups = interactions?.reduce((acc, interaction) => {
        const type = interaction.type || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const interactionMetrics = Object.entries(interactionGroups).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count
      }));

      setAnalytics({
        totalCustomers,
        newCustomersThisMonth,
        totalValue,
        conversionRate,
        customersByStatus,
        customersByMonth: monthlyData,
        topSources,
        interactionMetrics
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <CRMLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your CRM performance</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.newCustomersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Pipeline value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Lead to deal conversion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Interactions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.interactionMetrics.reduce((sum, metric) => sum + metric.count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total interactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>Monthly customer acquisition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.customersByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="customers" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pipeline Value</CardTitle>
                  <CardDescription>Monthly pipeline value trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.customersByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--success))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Status Distribution</CardTitle>
                  <CardDescription>Breakdown by customer status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.customersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.customersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>New customers by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.customersByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="customers" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Lead Sources</CardTitle>
                <CardDescription>Most effective customer acquisition channels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.topSources} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="customers" fill="hsl(var(--info))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interaction Types</CardTitle>
                <CardDescription>Breakdown of customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.interactionMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--warning))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CRMLayout>
  );
}