import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Edit, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PostCardProps {
  post: any;
  type: "event" | "recruitment";
  currentUsername: string;
  onEdit: () => void;
}

export const PostCard = ({ post, type, currentUsername, onEdit }: PostCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fix date comparison: post is expired only when today > end_date
  const today = new Date();
  const endDate = new Date(post.end_date);
  
  // Set time to end of day for end_date and start of day for today for accurate comparison
  endDate.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);
  
  const isExpired = today > endDate;
  const canEdit = currentUsername === post.username || currentUsername === "headshot";
  
  const handleDelete = async () => {
    if (!canEdit) return;
    
    setIsDeleting(true);
    try {
      const table = type === "event" ? "events" : "recruitments";
      const { error } = await supabase.from(table).delete().eq("id", post.id);
      
      if (error) throw error;
      toast({ title: "Post deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting post", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg ${isExpired ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {post.club_logo && (
              <img 
                src={post.club_logo} 
                alt={post.club_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg">{post.club_name}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpired && <Badge variant="destructive">Expired</Badge>}
            <Badge variant={type === "event" ? "default" : "secondary"}>
              {type === "event" ? "Event" : "Recruitment"}
            </Badge>
          </div>
        </div>
        {type === "event" && post.event_name && (
          <h3 className="text-xl font-semibold mt-2">{post.event_name}</h3>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {post.start_date === post.end_date 
              ? `${new Date(post.start_date).toLocaleDateString()}`
              : `${new Date(post.start_date).toLocaleDateString()} - ${new Date(post.end_date).toLocaleDateString()}`
            }
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="flex-1">
            <a href={type === "event" ? post.registration_link : post.recruitment_link} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              {type === "event" ? "Register" : "Apply"}
            </a>
          </Button>
          
          {post.whatsapp_group && (
            <Button asChild variant="outline" size="sm">
              <a href={post.whatsapp_group} target="_blank">
                <Users className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          )}
          
          {type === "event" && post.instagram_link && (
            <Button asChild variant="outline" size="sm">
              <a href={post.instagram_link} target="_blank">
                Instagram
              </a>
            </Button>
          )}
        </div>
        
        {canEdit && (
          <div className="flex gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};