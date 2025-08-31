import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostForm } from "@/components/PostForm";
import { PostSection } from "@/components/PostSection";
import { SearchBar } from "@/components/SearchBar";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"event" | "recruitment">("event");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [manageUsername, setManageUsername] = useState("");

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingPost(null);
  };

  const handleFormSuccess = () => {
    setSearchFilter("");
    setManageUsername("");
  };

  return (
    <div className="min-h-screen">
      <Header 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreatePost={() => setShowCreateForm(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Filter by Username/Club Name</h3>
              <SearchBar
                value={searchFilter}
                onChange={setSearchFilter}
                placeholder="Search posts..."
                type="filter"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Manage Posts (Enter Username)</h3>
              <SearchBar
                value={manageUsername}
                onChange={setManageUsername}
                placeholder="Enter username to manage posts..."
                type="manage"
              />
            </div>
          </div>
        </div>

        <PostSection
          type={activeTab}
          searchFilter={searchFilter}
          manageUsername={manageUsername}
          onEditPost={handleEditPost}
        />
      </main>

      <Footer />

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <PostForm
            editingPost={editingPost}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
