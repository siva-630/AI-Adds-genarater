import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyGenerations } from "../assets/assets";
import { GhostButton, PrimaryButton } from "../components/Buttons";
import { useAuth, useClerk, useUser } from "@clerk/react";
import type { Project } from "../components/Types";

const Result = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const fallbackGeneration = useMemo(
    () => dummyGenerations.find((item) => item.id === projectId) ?? dummyGenerations[0],
    [projectId]
  );
  const [generation, setGeneration] = useState<Project | null>(null);

  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingGeneration, setIsLoadingGeneration] = useState(true);
  const [dotCount, setDotCount] = useState(1);
  const apiBase = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setGeneration(null);
        setIsLoadingGeneration(false);
        return;
      }

      try {
        setIsLoadingGeneration(true);
        const response = await fetch(`${apiBase}/api/projects/${projectId}`);
        const data = await response.json();

        if (response.ok && data?.project) {
          setGeneration(data.project);
          return;
        }

        setGeneration(null);
      } catch {
        setGeneration(null);
      } finally {
        setIsLoadingGeneration(false);
      }
    };

    loadProject();
  }, [apiBase, projectId]);

  useEffect(() => {
    if (!generation) return;
    setActiveMedia(generation.generatedVideo ? "video" : "image");
  }, [generation]);

  const handleGenerateVideo = async () => {
    if (!isSignedIn) {
      openSignIn?.();
      return;
    }

    if (!user?.id) {
      alert('User not found. Please login again.');
      return;
    }

    try {
      setIsGeneratingVideo(true);

      const response = await fetch(`${apiBase}/api/user/consume-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          kind: 'video',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || 'Failed to consume credits for video');
        setIsGeneratingVideo(false);
        return;
      }

      window.dispatchEvent(new CustomEvent('credits-updated', { detail: { credits: data.credits } }));
      alert(`Video generation started. Remaining credits: ${data.credits}`);
    } catch {
      alert('Something went wrong while consuming credits for video.');
      setIsGeneratingVideo(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const token = await getToken();
      const response = await fetch(`${apiBase}/api/projects/${projectId}/publish`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data?.project) {
        setGeneration(data.project);
        alert("Published to community!");
      } else {
        alert(data?.message || "Failed to publish");
      }
    } catch {
      alert("Something went wrong while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  const displayedGeneration = generation ?? fallbackGeneration;
  const hasImage = Boolean(displayedGeneration?.generatedImage);
  const hasVideo = Boolean(displayedGeneration?.generatedVideo);

  useEffect(() => {
    if (!isGeneratingVideo) {
      setDotCount(1);
      return;
    }

    const timer = window.setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 350);

    return () => window.clearInterval(timer);
  }, [isGeneratingVideo]);

  if (isLoadingGeneration) {
    return (
      <div className="min-h-screen my-28 text-white px-6 md:px-12">
        <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-300">Loading result...</p>
        </div>
      </div>
    );
  }

  if (!displayedGeneration) {
    return (
      <div className="min-h-screen my-28 text-white px-6 md:px-12">
        <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-300">Result not found.</p>
          <PrimaryButton className="mt-4" onClick={() => navigate("/my-generations")}>Back to my generations</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 md:px-12 my-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">{displayedGeneration.productName}</h1>
              <p className="text-xs text-gray-400">Generation Result</p>
            </div>

            <div className="flex items-center gap-2">
              {hasImage && (
                <GhostButton
                  className={`${activeMedia === "image" ? "border-indigo-400/50 bg-indigo-500/10" : ""}`}
                  onClick={() => setActiveMedia("image")}
                >
                  Image
                </GhostButton>
              )}
              {hasVideo && (
                <GhostButton
                  className={`${activeMedia === "video" ? "border-indigo-400/50 bg-indigo-500/10" : ""}`}
                  onClick={() => setActiveMedia("video")}
                >
                  Video
                </GhostButton>
              )}
            </div>
          </div>

          <div className="relative bg-black/20">
            <div
              className={`${
                displayedGeneration.aspectRatio === "9:16"
                  ? "aspect-9/16"
                  : displayedGeneration.aspectRatio === "16:9"
                    ? "aspect-video"
                    : "aspect-square"
              } max-h-[75vh] mx-auto`}
            >
              {activeMedia === "video" && hasVideo ? (
                <video
                  src={displayedGeneration.generatedVideo}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : hasImage ? (
                <img
                  src={displayedGeneration.generatedImage}
                  alt={displayedGeneration.productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  No media available
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="bg-white/5 border border-white/10 rounded-2xl p-5 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Actions</h2>
          <p className="text-sm text-gray-400 mt-1">Download your generated assets or create a new one.</p>

          <div className="mt-5 flex flex-col gap-3">
            <PrimaryButton onClick={() => navigate("/generate")}>New Generation</PrimaryButton>

            {!hasVideo && (
              <PrimaryButton
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
              >
                {isGeneratingVideo ? `Generating video${".".repeat(dotCount)}` : "Generate video"}
              </PrimaryButton>
            )}

            {hasImage && (
              <a href={displayedGeneration.generatedImage} download>
                <GhostButton className="w-full justify-center">Download image</GhostButton>
              </a>
            )}

            {hasVideo && (
              <a href={displayedGeneration.generatedVideo} download>
                <GhostButton className="w-full justify-center">Download video</GhostButton>
              </a>
            )}

            {!displayedGeneration.isPublished && (
                <GhostButton className="w-full justify-center" onClick={handlePublish} disabled={isPublishing}>
                   {isPublishing ? "Publishing..." : "Publish to Community"}
                </GhostButton>
            )}
          </div>

          {hasVideo && (
            <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-200">✅ Successfully generated video.</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-300 space-y-1">
            <p><span className="text-gray-400">Aspect:</span> {displayedGeneration.aspectRatio}</p>
            <p><span className="text-gray-400">Created:</span> {new Date(displayedGeneration.createdAt).toLocaleString()}</p>
            {displayedGeneration.productDescription && (
              <p><span className="text-gray-400">Description:</span> {displayedGeneration.productDescription}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Result;