import Pricing from "../components/Pricing"

const Plans = () => {
  return (
    <div className="max-sm:py-10 sm:pt-20">

      <Pricing />

      <p className="mt-6 text-center text-sm sm:text-base text-gray-300 mb-5">
        Create stunning images for just <span className="text-indigo-400 font-semibold">5 credits</span> and generate immersive videos for <span className="text-indigo-400 font-semibold">10 credits</span>.
      </p>
    </div>
  )
}

export default Plans