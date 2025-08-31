import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PostSectionProps {
  type: "event" | "recruitment";
  searchFilter: string;
  manageUsername: string;
  onEditPost: (post: any) => void;
}

export const PostSection = ({ type, searchFilter, manageUsername, onEditPost }: PostSectionProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const table = type === "event" ? "events" : "recruitments";
      let query = supabase.from(table).select("*").order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Sort posts: active first, then expired
      const sortedPosts = (data || []).sort((a, b) => {
        // Fix date comparison logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const aEndDate = new Date(a.end_date);
        const bEndDate = new Date(b.end_date);
        aEndDate.setHours(23, 59, 59, 999);
        bEndDate.setHours(23, 59, 59, 999);
        
        const aExpired = today > aEndDate;
        const bExpired = today > bEndDate;
        
        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setPosts(sortedPosts.slice(0, 25)); // Limit to 25 posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription
    const table = type === "event" ? "events" : "recruitments";
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [type]);

  // Filter posts based on search criteria
  const filteredPosts = posts.filter((post) => {
    if (manageUsername) {
      return post.username.toLowerCase().includes(manageUsername.toLowerCase());
    }
    
    if (searchFilter) {
      return (
        post.club_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        post.username.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {type}s found
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          type={type}
          currentUsername={manageUsername}
          onEdit={() => onEditPost(post)}
        />
      ))}
    </div>
  );
};