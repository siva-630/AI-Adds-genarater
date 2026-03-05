import { useNavigate } from "react-router-dom"
import type { Project } from "./Types"
import { useState } from "react";
import { img, span } from "framer-motion/client";
import { Loader2Icon } from "lucide-react";

const ProjectCard = ({ gen, setGenerations, forCommunity = false }:
    {gen:Project,setGenerations:React.Dispatch<React.SetStateAction<Project[]>>,forCommunity:boolean}
) => {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    
    <div>

      <div key={gen.id} className="mb-4 break-inside-avoid">
        
        <div className="bg-white/5 border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">
          
          {/* preview */}
          <div className={`${
            gen?.aspectRatio === '9:16' ? 'aspect-9/16' :
            gen?.aspectRatio === '16:9' ? 'aspect-video' :
            'aspect-square'
          } relative overflow-hidden`}>
            {gen.generatedImage && (
              <img src={gen.generatedImage} alt="gen.productName"
              
                className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo ? 'group-hover:opacity-0' :
                'group-hover:scale-105'
              }`}/>
            )}
        
            
            {gen.generatedVideo && (
               
              <video src={gen.generatedVideo} muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0
              group-hover:opacity-100 transition duration-500"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
              
            )}
            {(!gen?.generatedImage && !gen?.generatedVideo) && (

              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/20 ">
                <Loader2Icon className="size-7 animate-spin"/>
                
                </div>
            )}

            {/* status badges */}
            
            <div className="absolute left-3 top-3 flex gap-2 
             items-center">
              {gen.isGenerating && (
                <span className="text-xs px-2 py-1 bg-yellow-600/30
                rounded-full">Generating</span>
              )}

              {gen.isPublished && (
                <span className="text-xs px-2 py-1 green-600/30 rounded-full">Published</span>
              )}
             </div>

            {/* source images */}
            <div className="absolute right-3 bottom-3">
              <img src={gen.uploadedImages[0]} alt="product"
                className="w-16 h-16 object-cover rounded-full animate-float" />
              <img src={gen.uploadedImages[1]} alt="model"
              className="w-16 h-16 object-cover rounded-full animate-float -ml-8 " style={{animationDelay:'3s'}}/>
            </div>
    

          </div>

          {/* details */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">

              <div>
                <h3>{gen.productName}</h3>
                <p>create: {new Date(gen.createdAt).toLocaleString()}</p>
                {gen.updatedAt && (
                  <p>Update : {new Date(gen.createdAt).toLocaleString()}</p>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default ProjectCard