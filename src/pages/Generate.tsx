import { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/UploadZone"
import { Loader2Icon, RectangleHorizontalIcon, RectangleVerticalIcon, Wand2Icon } from "lucide-react";
import { PrimaryButton } from "../components/Buttons";
import { useAuth, useClerk } from "@clerk/react";

const Generate = () => {
    const { isSignedIn } = useAuth();
    const { openSignIn } = useClerk();


    const [name, setName] = useState(' ');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('')
    const [aspectRatio, setAspectRatio] = useState('9:16')
    const[productImage,setProductImage] = useState<File | null >(null)
    const[modelImage , setModelImage] = useState<File | null>(null)
    const [userPrompt, setUserPrompt] = useState('');
    const [isGenerating] = useState(false);

    const requireAuth = () => {
        if (isSignedIn) return true;

        openSignIn?.();
        return false;
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
        if (!requireAuth()) {
            e.target.value = '';
            return;
        }

        if (e.target.files && e.target.files[0]) {
            if (type === 'product') setProductImage(e.target.files[0]);
            else setModelImage(e.target.files[0])
        }
    }

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!requireAuth()) return;
    }


  return (
      <div className="min-h-screen text-white p-6 md:p-12 mt-28">
          <form  onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40">
              <Title heading="Create in-context Image" description="Upload your model and product image to generate stunning UGC,
              short-form videos and social media post"/>

              <div className="flex gap-20 max-sm:flex-col items-start justify-between">
              <div className="flex flex-col  w-full sm:max-w-60 gap-8 mt-8 mb-12">
                   
                      <UploadZone label="product image" file={productImage} onClear={() => {
                          setProductImage(null)
                      }} onChange={(e) => handleFileChange(e, 'product')} />
                      

                      <UploadZone label="Model image" file={modelImage} onClear={() => {
                          setModelImage(null)
                      } } onChange={ (e)=> handleFileChange(e, 'model')} />
                  </div>
                  

              {/* right column */}
                  <div className="w-full">
                      <div className="mb-4  text-gray-300">
                      <label  htmlFor="name" className="block text-sm mb-4">Project Name</label>
                
                  
                <input type="text" id="name" value={name} onChange={
                              (e) => setName(e.target.value)} placeholder="Name Your  project" required
                    className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all "      />
                      </div>


                      <div className="mb-4 text-gray-300">
                      <label  htmlFor="ProductName" className="block text-sm mb-4">Product Name</label>
                
                  
                <input type="text" id="ProjectName"  value={productName} onChange={
                              (e) => setProductName(e.target.value)} placeholder="Name Your  project" required
                    className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all "      />
                      </div>
              
                     <div className="mb-4 text-gray-300">
                          <label htmlFor="ProductName" className="block text-sm mb-4">Product Description
                              <span className="text-xs text-violet-400 ">(optional)</span>
                      </label>
                      
                          <textarea id="productionDescription" rows={4} value={productDescription}
                              onChange={(e) => setProductDescription(e.target.value)} placeholder="Enter the description of the product"
                          className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none resize-node transition-all "/>
                  
                          
                          <div className="mb-4 text-gray-300">
                              <label className="block text-sm mb-4">Aspect Ratio</label>
                              

                              <div className="flex gap-3">
                                  <RectangleVerticalIcon onClick={() => setAspectRatio('9:16')}
                                  className={`p-2.5 size-13 bg-white/6 rounded transitional-all  ring-2 ring-transparent cursor-pointer  ${aspectRatio === '9:16' ? 'ring-violet-500/50 bg-white/10':" "} `}
                                  />

                                  <RectangleHorizontalIcon onClick={() => {
                                      setAspectRatio('16:9')
                                      
                                  }} className={`p-2.5 size-13 bg-white/6  rounded transitional-all ring-2 
                                  ring-transparent cursor-pointer  ${aspectRatio === '16:9' ? 'ring-violet-500/50 bg-white/10' : " "}`} />

                                  
                                  
                                  
                              </div>
                              
                              
                          </div>
                          <textarea id="UserPrompt" rows={4} value={userPrompt}
                              onChange={(e) => setUserPrompt(e.target.value)} placeholder="Describe how you want the narration to be."
                          className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none resize-node transition-all "/>


                
                      </div>
                      
                       


              </div>
                  
              </div>


              <div className="flex justify-center mt-10">
                  <PrimaryButton disabled={isGenerating} className="px-10 py-3 rounded-md disabled:opacity-70  disabled:cursor-not-allowed">
                      {isGenerating ? (
                          <>
                              <Loader2Icon className="size-5 animate-spin "/> Generating...
                      
                          </>) :
                      
                          (<>
                              <Wand2Icon className="size-5 "/> Generate Image
                          
                          </>)}
                  </PrimaryButton>
                  
              </div>
            

          </form>

      </div>
      

  )
}

export default Generate