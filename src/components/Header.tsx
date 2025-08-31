import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users } from "lucide-react";

interface HeaderProps {
  activeTab: "event" | "recruitment";
  onTabChange: (tab: "event" | "recruitment") => void;
  onCreatePost: () => void;
}

export const Header = ({ activeTab, onTabChange, onCreatePost }: HeaderProps) => {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VITC Clubs Hub
            </h1>
            <p className="text-muted-foreground">Recruitments & Events Platform</p>
          </div>
          
          <Button onClick={onCreatePost} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === "event" ? "default" : "outline"}
            onClick={() => onTabChange("event")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Events
          </Button>
          <Button
            variant={activeTab === "recruitment" ? "default" : "outline"}
            onClick={() => onTabChange("recruitment")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Recruitments
          </Button>
        </div>
      </div>
    </header>
  );
};