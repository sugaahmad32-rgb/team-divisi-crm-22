import { useState, useMemo } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInteractions } from "@/hooks/useInteractions";
import { useCustomers } from "@/hooks/useCustomers";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Phone, MessageCircle, Mail, Users, Edit, Trash2, Check } from "lucide-react";
import { formatDistanceToNow, isToday, isPast, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Followups = () => {
  const { interactions, loading: interactionsLoading, markAsCompleted, updateInteraction, deleteInteraction } = useInteractions();
  const { customers, loading: customersLoading } = useCustomers();
  const { toast } = useToast();

  // Filter follow-up interactions
  const followupInteractions = useMemo(() => {
    return interactions.filter(interaction => 
      interaction.type === 'followup' || 
      (interaction.due_date && interaction.status === 'pending')
    );
  }, [interactions]);

  // Categorize follow-ups
  const categorizedFollowups = useMemo(() => {
    const today = new Date();
    
    const overdue = followupInteractions.filter(interaction => {
      if (!interaction.due_date) return false;
      const dueDate = new Date(interaction.due_date);
      return isPast(dueDate) && !isToday(dueDate) && interaction.status === 'pending';
    });

    const todayDue = followupInteractions.filter(interaction => {
      if (!interaction.due_date) return false;
      const dueDate = new Date(interaction.due_date);
      return isToday(dueDate) && interaction.status === 'pending';
    });

    const upcoming = followupInteractions.filter(interaction => {
      if (!interaction.due_date) return false;
      const dueDate = new Date(interaction.due_date);
      return dueDate > today && interaction.status === 'pending';
    });

    const completed = followupInteractions.filter(interaction => 
      interaction.status === 'done'
    );

    return {
      overdue,
      todayDue,
      upcoming,
      completed
    };
  }, [followupInteractions]);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.name} (${customer.company || 'No company'})` : 'Unknown Customer';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'call': Phone,
      'whatsapp': MessageCircle,
      'email': Mail,
      'meeting': Users,
      'followup': Clock,
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  const handleEdit = (interaction: any) => {
    // For now, just show a toast. Could implement edit modal later
    toast({
      title: "Edit functionality",
      description: "Edit interaction feature coming soon",
    });
  };

  const handleDelete = async (interaction: any) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      await deleteInteraction(interaction.id);
    }
  };

  const renderInteractionCard = (interaction: any) => {
    const TypeIcon = getTypeIcon(interaction.type);
    const getStatusColor = (status: string): "default" | "destructive" | "outline" | "secondary" => {
      const colors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
        'pending': 'secondary',
        'done': 'default',
        'overdue': 'destructive',
      };
      return colors[status] || 'secondary';
    };

    return (
      <Card key={interaction.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base capitalize">{interaction.type}</CardTitle>
            </div>
            <Badge variant={getStatusColor(interaction.status)}>
              {interaction.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{interaction.notes}</p>
          
          <div className="text-xs text-muted-foreground">
            <div>Created: {format(new Date(interaction.created_at), 'MMM dd, yyyy HH:mm')}</div>
            {interaction.due_date && (
              <div>Due: {format(new Date(interaction.due_date), 'MMM dd, yyyy HH:mm')}</div>
            )}
            {interaction.completed_at && (
              <div>Completed: {format(new Date(interaction.completed_at), 'MMM dd, yyyy HH:mm')}</div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleEdit(interaction)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            
            {interaction.status !== 'done' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => markAsCompleted(interaction.id)}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark Done
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleDelete(interaction)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const loading = interactionsLoading || customersLoading;

  if (loading) {
    return (
      <CRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading follow-ups...</p>
          </div>
        </div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Follow-ups</h1>
            <p className="text-muted-foreground">
              Manage all your customer follow-up activities
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {categorizedFollowups.overdue.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {categorizedFollowups.todayDue.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {categorizedFollowups.upcoming.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {categorizedFollowups.completed.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Follow-ups Tabs */}
        <Tabs defaultValue="overdue" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overdue" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Overdue ({categorizedFollowups.overdue.length})
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today ({categorizedFollowups.todayDue.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming ({categorizedFollowups.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({categorizedFollowups.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overdue" className="space-y-4">
            {categorizedFollowups.overdue.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No overdue follow-ups</p>
                </CardContent>
              </Card>
            ) : (
              categorizedFollowups.overdue.map((interaction) => (
                <div key={interaction.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{getCustomerName(interaction.customer_id)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due {formatDistanceToNow(new Date(interaction.due_date!))} ago
                      </p>
                    </div>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>
                  {renderInteractionCard(interaction)}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {categorizedFollowups.todayDue.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No follow-ups due today</p>
                </CardContent>
              </Card>
            ) : (
              categorizedFollowups.todayDue.map((interaction) => (
                <div key={interaction.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{getCustomerName(interaction.customer_id)}</h3>
                      <p className="text-sm text-muted-foreground">Due today</p>
                    </div>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  {renderInteractionCard(interaction)}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {categorizedFollowups.upcoming.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No upcoming follow-ups</p>
                </CardContent>
              </Card>
            ) : (
              categorizedFollowups.upcoming.map((interaction) => (
                <div key={interaction.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{getCustomerName(interaction.customer_id)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due in {formatDistanceToNow(new Date(interaction.due_date!))}
                      </p>
                    </div>
                    <Badge>Upcoming</Badge>
                  </div>
                  {renderInteractionCard(interaction)}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {categorizedFollowups.completed.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No completed follow-ups</p>
                </CardContent>
              </Card>
            ) : (
              categorizedFollowups.completed.map((interaction) => (
                <div key={interaction.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{getCustomerName(interaction.customer_id)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed {interaction.completed_at ? formatDistanceToNow(new Date(interaction.completed_at)) + ' ago' : 'recently'}
                      </p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  {renderInteractionCard(interaction)}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

      </div>
    </CRMLayout>
  );
};

export default Followups;