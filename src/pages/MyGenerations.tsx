import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../components/Types";
import { PrimaryButton } from "../components/Buttons";
import { api } from "../lib/api";
import { useAuth, useClerk, useUser } from "@clerk/react";






const MyGenerations = () => {
  const [generation, setGenerations] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null);
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
    
    const [loading, setLoading] = useState(true);
  
  
    const fetchMyGeneration = async () => {
      if (!isSignedIn || !user?.id) {
        setGenerations([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await api.getUserProjects(user.id);
        setGenerations(data.projects ?? []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load your generations');
        setGenerations([]);
      } finally {
        setLoading(false);
      }
    }
  
  
    useEffect(() => {
      fetchMyGeneration()
    }, [isSignedIn, user?.id])

    const requireAuth = async () => {
      if (isSignedIn && user?.id) {
        const token = await getToken();
        if (token) return token;
      }

      openSignIn?.();
      return null;
    };

    const handleDelete = async (id: string) => {
      const shouldDelete = window.confirm("Delete this generation?");
      if (!shouldDelete) return;

      const token = await requireAuth();
      if (!token) return;

      try {
        await api.deleteProject(id, token);
      } catch (err: any) {
        alert(err?.message || 'Failed to delete project');
        return;
      }

      setGenerations((prev) => prev.filter((item) => item.id !== id));
    };

    const handleShare = async (gen: Project) => {
      const shareUrl = gen.generatedVideo || gen.generatedImage;
      if (!shareUrl) return;

      try {
        if (navigator.share) {
          await navigator.share({
            title: gen.productName,
            text: gen.productDescription || "Check out this generation",
            url: shareUrl,
          });
          return;
        }

        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard");
      } catch {
        // no-op
      }
    };

    const togglePublished = async (id: string) => {
      const token = await requireAuth();
      if (!token || !user?.id) return;

      try {
        const data = await api.toggleProjectPublished(id, user.id, token);
        setGenerations((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, isPublished: data.isPublished }
              : item
          )
        );
        return;
      } catch (err: any) {
        alert(err?.message || 'Failed to toggle publish state');
      }

      setGenerations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isPublished: !Boolean(item.isPublished) }
            : item
        )
      );
    };
  return loading ? (
  
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-7 animate-spin text-indigo-400"/>
      </div>

    </div>

  ) : (
    
          <div className="min-h-screen text-white p-6 md:p-12 my-28">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Ny Generations</h1>
            <p>View and manage your ai generated content</p>
          </header>

          {error && <p className="text-red-300 mb-6">{error}</p>}


          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {generation.map((gen) => (
              <ProjectCard
                key={gen.id}
                gen={gen}
                onShare={handleShare}
                onDelete={handleDelete}
                onTogglePublished={togglePublished}
              />
            ))}
          </div>
          
          {generation.length === 0 && (
            <div  className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-xl font-medium mb-2">No generation yet</h3>
              <p className="text-gray-400 mb-6">start creating stunning product photos today</p>
              <PrimaryButton onClick={()=>window.location.href ='/generate'}>
                Create new generation
              </PrimaryButton>
            </div>
          )}

         

        </div>

      </div>
      
  )
    
}

export default MyGenerations;