import { Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-md border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Developed with ❤️ by{" "}
              <span className="font-semibold text-foreground">Meijeevan, VITC</span>
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://www.linkedin.com/in/meijeevan-kt-845236322" 
                target="_blank" 
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://github.com/MEIJEEVAN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};