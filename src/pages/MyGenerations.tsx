import { useEffect, useState } from "react";
import { dummyGenerations } from "../assets/assets";
import { Loader2 } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../components/Types";
import { PrimaryButton } from "../components/Buttons";






const MyGenerations = () => {
  const [generation, setGenerations] = useState<Project[]>([])
    
    const [loading, setLoading] = useState(true);
  
  
    const fetchMyGeneration = async () => {
      setTimeout(() => {
        setGenerations(dummyGenerations);
        setLoading(false)
      },3000)
    }
  
  
    useEffect(() => {
      fetchMyGeneration()
    }, [])

    const handleDelete = (id: string) => {
      const shouldDelete = window.confirm("Delete this generation?");
      if (!shouldDelete) return;

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

    const togglePublished = (id: string) => {
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