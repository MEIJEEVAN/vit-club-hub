import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PostFormData {
  type: "event" | "recruitment";
  username: string;
  club_name: string;
  club_logo?: string;
  event_name?: string;
  start_date: string;
  end_date: string;
  registration_link: string;
  whatsapp_group?: string;
  instagram_link?: string;
  linkedin_link?: string;
}

interface PostFormProps {
  editingPost?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const PostForm = ({ editingPost, onClose, onSuccess }: PostFormProps) => {
  const [formData, setFormData] = useState<PostFormData>({
    type: editingPost?.event_name ? "event" : editingPost ? "recruitment" : "event",
    username: editingPost?.username || "",
    club_name: editingPost?.club_name || "",
    club_logo: editingPost?.club_logo || "",
    event_name: editingPost?.event_name || "",
    start_date: editingPost?.start_date || "",
    end_date: editingPost?.end_date || "",
    registration_link: editingPost?.registration_link || editingPost?.recruitment_link || "",
    whatsapp_group: editingPost?.whatsapp_group || "",
    instagram_link: editingPost?.instagram_link || "",
    linkedin_link: editingPost?.linkedin_link || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate < startDate) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }
    
    if (!formData.username || !formData.club_name || !formData.start_date || !formData.end_date || !formData.registration_link) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const table = formData.type === "event" ? "events" : "recruitments";
      
      let data: any = {
        username: formData.username,
        club_name: formData.club_name,
        club_logo: formData.club_logo,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      if (formData.type === "event") {
        data = {
          ...data,
          event_name: formData.event_name,
          registration_link: formData.registration_link,
          whatsapp_group: formData.whatsapp_group,
          instagram_link: formData.instagram_link,
          linkedin_link: formData.linkedin_link,
        };
      } else {
        data = {
          ...data,
          recruitment_link: formData.registration_link,
        };
      }

      let result;
      if (editingPost) {
        result = await supabase.from(table).update(data).eq("id", editingPost.id);
      } else {
        result = await supabase.from(table).insert([data]);
      }

      if (result.error) throw result.error;

      toast({ title: editingPost ? "Post updated successfully" : "Post created successfully" });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ title: "Error saving post", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value: "event" | "recruitment") => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="recruitment">Recruitment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Your username"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="club_name">Club Name *</Label>
            <Input
              id="club_name"
              value={formData.club_name}
              onChange={(e) => setFormData({...formData, club_name: e.target.value})}
              placeholder="Club name"
              required
            />
          </div>

          {formData.type === "event" && (
            <div>
              <Label htmlFor="event_name">Event Name</Label>
              <Input
                id="event_name"
                value={formData.event_name}
                onChange={(e) => setFormData({...formData, event_name: e.target.value})}
                placeholder="Event name"
              />
            </div>
          )}

          <div>
            <Label htmlFor="club_logo">Club Logo URL</Label>
            <Input
              id="club_logo"
              value={formData.club_logo}
              onChange={(e) => setFormData({...formData, club_logo: e.target.value})}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="registration_link">{formData.type === "event" ? "Registration" : "Application"} Link *</Label>
            <Input
              id="registration_link"
              value={formData.registration_link}
              onChange={(e) => setFormData({...formData, registration_link: e.target.value})}
              placeholder="https://example.com/register"
              required
            />
          </div>

          {formData.type === "event" && (
            <>
              <div>
                <Label htmlFor="whatsapp_group">WhatsApp Group Link</Label>
                <Input
                  id="whatsapp_group"
                  value={formData.whatsapp_group}
                  onChange={(e) => setFormData({...formData, whatsapp_group: e.target.value})}
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram_link">Instagram Link</Label>
                  <Input
                    id="instagram_link"
                    value={formData.instagram_link}
                    onChange={(e) => setFormData({...formData, instagram_link: e.target.value})}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkedin_link">LinkedIn Link</Label>
                  <Input
                    id="linkedin_link"
                    value={formData.linkedin_link}
                    onChange={(e) => setFormData({...formData, linkedin_link: e.target.value})}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : (editingPost ? "Update Post" : "Create Post")}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};