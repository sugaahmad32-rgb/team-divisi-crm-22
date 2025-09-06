import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, RotateCcw, User } from "lucide-react";
import { useSwitchUser } from "@/hooks/useSwitchUser";
import { useAuth } from "@/contexts/AuthContext";

const roleLabels = {
  superadmin: "Super Admin",
  owner: "Owner", 
  manager: "Manager",
  supervisor: "Supervisor",
  marketing: "Marketing"
};

const roleColors = {
  superadmin: "bg-destructive text-destructive-foreground",
  owner: "bg-primary text-primary-foreground",
  manager: "bg-info text-info-foreground", 
  supervisor: "bg-warning text-warning-foreground",
  marketing: "bg-success text-success-foreground"
};

export function SwitchUserButton() {
  const { profile } = useAuth();
  const { availableUsers, loading, isImpersonating, switchToUser, endImpersonation } = useSwitchUser();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [open, setOpen] = useState(false);

  if (!profile || (!availableUsers.length && !isImpersonating)) {
    return null;
  }

  const handleSwitchUser = async () => {
    if (selectedUserId) {
      await switchToUser(selectedUserId);
      setOpen(false);
      setSelectedUserId("");
    }
  };

  const handleEndImpersonation = async () => {
    await endImpersonation();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isImpersonating ? "destructive" : "ghost"}
          size="sm"
          className="h-8 gap-2"
        >
          {isImpersonating ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Switch Back
            </>
          ) : (
            <>
              <UserCog className="h-4 w-4" />
              Switch User
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            {isImpersonating ? "Return to Original Account" : "Switch User View"}
          </DialogTitle>
          <DialogDescription>
            {isImpersonating 
              ? "You are currently viewing as another user. Click below to return to your original account."
              : "Select a user to view the system from their perspective. This is useful for support and testing purposes."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isImpersonating ? (
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current View</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are viewing the system as another user. Some actions may be restricted.
                </p>
              </div>
              
              <Button 
                onClick={handleEndImpersonation}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "Switching back..." : "Return to My Account"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select User to Switch To:
                </label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2 w-full">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {user.display_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user.display_name}</div>
                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${roleColors[user.role as keyof typeof roleColors] || roleColors.marketing}`}
                            >
                              {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                            </Badge>
                            {user.division_name && (
                              <span className="text-xs text-muted-foreground">{user.division_name}</span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSwitchUser}
                  disabled={!selectedUserId || loading}
                  className="flex-1"
                >
                  {loading ? "Switching..." : "Switch User"}
                </Button>
              </div>

              {availableUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users available to switch to based on your current role.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}