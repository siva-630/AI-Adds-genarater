
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = "/";
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen my-28 px-6 md:px-12 text-white flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <Loader2 className="size-10 mx-auto text-indigo-400 animate-spin" />
        <h1 className="mt-4 text-2xl font-semibold">Loading...</h1>
        <p className="mt-2 text-sm text-gray-400">Please wait, redirecting you to home.</p>
      </div>
    </div>
  )
}

export default Loading