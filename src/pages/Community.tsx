import { useEffect, useState } from "react"
import type { Project } from "../components/Types"
import { Loader2 } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { api } from "../lib/api";


export const Community = () => {
  const [Projects, setProjects] = useState<Project[]>([])
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPublishedProjects();
      setProjects(data.projects ?? []);
    } catch (err: any) {
      setError(err?.message || "Failed to load published projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchProjects()
  }, [])

  return loading? (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-7 animate-spin text-indigo-400"/>
      </div>
      
   </div>
  ) : (
      <div className="min-h-screen text-white p-6 md:p-12 my-28">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Community</h1>
            <p>See what others are creating adds</p>
          </header>

          {/* projects */}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {error && <p className="text-red-300 mb-4">{error}</p>}
            {Projects.map((project) => (
              <ProjectCard
                key={project.id}
                gen={project}
                forCommunity
              />
            ))}
          </div>
          
         

        </div>

      </div>
  )
}
