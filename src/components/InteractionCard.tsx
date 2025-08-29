import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Interaction } from "@/hooks/useInteractions";
import { Phone, MessageCircle, Mail, Users, Clock, Edit, Trash2, Check } from "lucide-react";
import { format } from "date-fns";

interface InteractionCardProps {
  interaction: Interaction;
  onEdit: (interaction: Interaction) => void;
  onDelete: (interaction: Interaction) => void;
  onMarkCompleted: (id: string) => void;
}

export const InteractionCard = ({ interaction, onEdit, onDelete, onMarkCompleted }: InteractionCardProps) => {
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

  const getStatusColor = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const colors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'pending': 'secondary',
      'done': 'default',
      'overdue': 'destructive',
    };
    return colors[status] || 'secondary';
  };

  const TypeIcon = getTypeIcon(interaction.type);

  return (
    <Card className="hover:shadow-md transition-shadow">
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
            onClick={() => onEdit(interaction)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          
          {interaction.status !== 'done' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onMarkCompleted(interaction.id)}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark Done
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete(interaction)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};