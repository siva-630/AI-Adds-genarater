import type { Project } from "./Types"
import { EllipsisIcon, ImageIcon, Loader2Icon, Share2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GhostButton, PrimaryButton } from "./Buttons";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({
  gen,
  forCommunity = false,
  onShare,
  onDelete,
  onTogglePublished,
}: {
  gen: Project;
  forCommunity?: boolean;
  onShare?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onTogglePublished?: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mediaTypeLabel = gen.generatedImage && gen.generatedVideo
    ? "Image + Video"
    : gen.generatedVideo
      ? "Video"
      : gen.generatedImage
        ? "Image"
        : "Pending";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShare = async () => {
    if (onShare) {
      onShare(gen);
      setMenuOpen(false);
      return;
    }

    const url = gen.generatedVideo || gen.generatedImage;
    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: gen.productName,
          text: gen.productDescription || "Check out this generation",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // no-op (cancelled share or clipboard blocked)
    } finally {
      setMenuOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete?.(gen.id);
    setMenuOpen(false);
  };

  const handleViewDetails = () => {
    navigate(`/result/${gen.id}`);
    window.scrollTo(0, 0);
  };

  const handleTogglePublished = () => {
    onTogglePublished?.(gen.id);
  };

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
            
            {/* action menu */}
          
            {!forCommunity && (
              <div
                ref={menuRef}
                className="absolute right-3 top-3 z-40"
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="bg-black/60 hover:bg-black/80 text-white border border-white/20 rounded-full p-1.5 transition shadow"
                  aria-label="Open card menu"
                >
                  <EllipsisIcon className="size-5" />
                </button>

                {menuOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-black/70 backdrop-blur text-white border border-gray-500/50 rounded-lg shadow-md py-1 text-xs">
                    {(gen.generatedImage || gen.generatedVideo) && (
                      <li>
                        <button
                          type="button"
                          onClick={handleShare}
                          className="w-full text-left flex gap-2 items-center px-4 py-2 hover:bg-black/30 cursor-pointer"
                        >
                          <Share2Icon size={14} /> Share
                        </button>
                      </li>
                    )}
                    {gen.generatedImage && (
                      <li>
                        <a
                          href={gen.generatedImage}
                          download
                          className="flex gap-2 items-center px-4 py-2 hover:bg-black/30 cursor-pointer"
                        >
                          <ImageIcon size={14} /> Download image
                        </a>
                      </li>
                    )}
                    {gen.generatedVideo && (
                      <li>
                        <a
                          href={gen.generatedVideo}
                          download
                          className="flex gap-2 items-center px-4 py-2 hover:bg-black/30 cursor-pointer"
                        >
                          <span className="text-[10px] font-semibold">VID</span> Download video
                        </a>

                        
                      </li>
                    )}
                    {onDelete && (
                      <li>
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="w-full text-left flex gap-2 items-center px-4 py-2 text-red-300 hover:bg-red-500/20 cursor-pointer"
                        >
                          <Trash2Icon size={14} /> Delete
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
             )}




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

              <div className="flex-1">
                <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>

                <p className="text-sm text-gray-400">create: {new Date(gen.createdAt).toLocaleString()}</p>
                {gen.updatedAt && (
                  <p className="text-xs text-gray-500 mt-1">Update : {new Date(gen.createdAt).toLocaleString()}</p>
                )}
              </div>

              <div className="text-right">
                <div className="mt-2 flex flex-col items-end gap-1">
                  <span className="text-xs px-2 py-1 bg-white/5">
                    Aspect: {gen.aspectRatio}
                  </span>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-md text-indigo-200 cursor-default"
                  >
                    Contains: {mediaTypeLabel}
                  </button>
                </div>
              </div>

            </div>

            {/* product description */}
            {gen.productDescription && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <div className="text-sm text-gray-300 bg-white/3 p-2 rounded-md wrap-break-word">{gen.productDescription}</div>
              </div>
            )}
            
            {/* user prompt */}

            {gen.userPrompt && (
              <div className="mt-3">
                
                <div className="text-xs text-gray-300">{gen.userPrompt}</div>
              </div>
              )}

            {!forCommunity && (
              <div className="mt-4 flex flex-wrap gap-2">
                <GhostButton onClick={handleViewDetails}>
                  View details
                </GhostButton>
                <PrimaryButton onClick={handleTogglePublished}>
                  {Boolean(gen.isPublished) ? "Unpublished" : "Published"}
                </PrimaryButton>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  )
}

export default ProjectCard