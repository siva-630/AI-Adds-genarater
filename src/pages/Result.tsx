import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyGenerations } from "../assets/assets";
import { GhostButton, PrimaryButton } from "../components/Buttons";

const Result = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const generation = useMemo(
    () => dummyGenerations.find((item) => item.id === projectId) ?? dummyGenerations[0],
    [projectId]
  );

  const [activeMedia, setActiveMedia] = useState<"image" | "video">(
    generation?.generatedVideo ? "video" : "image"
  );
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [dotCount, setDotCount] = useState(1);

  const hasImage = Boolean(generation?.generatedImage);
  const hasVideo = Boolean(generation?.generatedVideo);

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

  if (!generation) {
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
              <h1 className="text-xl md:text-2xl font-semibold">{generation.productName}</h1>
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
                generation.aspectRatio === "9:16"
                  ? "aspect-9/16"
                  : generation.aspectRatio === "16:9"
                    ? "aspect-video"
                    : "aspect-square"
              } max-h-[75vh] mx-auto`}
            >
              {activeMedia === "video" && hasVideo ? (
                <video
                  src={generation.generatedVideo}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : hasImage ? (
                <img
                  src={generation.generatedImage}
                  alt={generation.productName}
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
                onClick={() => setIsGeneratingVideo(true)}
                disabled={isGeneratingVideo}
              >
                {isGeneratingVideo ? `Generating video${".".repeat(dotCount)}` : "Generate video"}
              </PrimaryButton>
            )}

            {hasImage && (
              <a href={generation.generatedImage} download>
                <GhostButton className="w-full justify-center">Download image</GhostButton>
              </a>
            )}

            {hasVideo && (
              <a href={generation.generatedVideo} download>
                <GhostButton className="w-full justify-center">Download video</GhostButton>
              </a>
            )}
          </div>

          {hasVideo && (
            <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-200">✅ Successfully generated video.</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-300 space-y-1">
            <p><span className="text-gray-400">Aspect:</span> {generation.aspectRatio}</p>
            <p><span className="text-gray-400">Created:</span> {new Date(generation.createdAt).toLocaleString()}</p>
            {generation.productDescription && (
              <p><span className="text-gray-400">Description:</span> {generation.productDescription}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Result;