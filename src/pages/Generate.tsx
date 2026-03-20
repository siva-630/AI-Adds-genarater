import { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/UploadZone"
import { Loader2Icon, RectangleHorizontalIcon, RectangleVerticalIcon, Wand2Icon } from "lucide-react";
import { PrimaryButton } from "../components/Buttons";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

const Generate = () => {
    const { getToken, isSignedIn } = useAuth();
    const { openSignIn } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();


    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('')
    const [aspectRatio, setAspectRatio] = useState('9:16')
    const[productImage,setProductImage] = useState<File | null >(null)
    const[modelImage , setModelImage] = useState<File | null>(null)
    const [userPrompt, setUserPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const apiBase = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

    const requireAuth = () => {
        if (isSignedIn) return true;

        openSignIn?.();
        return false;
    };

    const requireAuthToken = async () => {
        if (!isSignedIn) {
            openSignIn?.();
            return null;
        }

        const token = await getToken();
        if (!token) {
            openSignIn?.();
            return null;
        }

        return token;
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

        if (!productImage || !modelImage) {
            alert('Please upload both product image and model image.');
            return;
        }

        if (!user?.id) {
            alert('User not found. Please login again.');
            return;
        }

        try {
            setIsGenerating(true);

            const token = await requireAuthToken();
            if (!token) {
                setIsGenerating(false);
                return;
            }

            const response = await fetch(`${apiBase}/api/user/consume-credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    kind: 'image',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data?.message || 'Failed to consume credits');
                return;
            }

            const createProjectBody = new FormData();
            createProjectBody.append('name', name.trim());
            createProjectBody.append('productName', productName.trim());
            createProjectBody.append('productDescription', productDescription.trim());
            createProjectBody.append('userPrompt', userPrompt.trim());
            createProjectBody.append('aspectRatio', aspectRatio);
            createProjectBody.append('targetLength', '5');
            createProjectBody.append('productImage', productImage);
            createProjectBody.append('modelImage', modelImage);

            const createProjectResponse = await fetch(`${apiBase}/api/projects`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: createProjectBody,
            });

            const created = await createProjectResponse.json();

            if (!createProjectResponse.ok) {
                alert(created?.message || 'Failed to create project');
                return;
            }

            const projectId = String(created?.project?.id ?? '').trim();
            if (!projectId) {
                alert('Project was created, but no project ID was returned.');
                return;
            }

            const editPrompt = [
                `Create a high-quality ad image for the product "${productName.trim()}".`,
                productDescription.trim() ? `Product details: ${productDescription.trim()}.` : '',
                userPrompt.trim() ? `Additional style instructions: ${userPrompt.trim()}.` : '',
                'Preserve realistic lighting and professional composition.',
            ].filter(Boolean).join(' ');

            const imageEditBody = new FormData();
            imageEditBody.append('prompt', editPrompt);

            const imageEditResponse = await fetch(`${apiBase}/api/projects/${projectId}/image-edit`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: imageEditBody,
            });

            const edited = await imageEditResponse.json();

            if (!imageEditResponse.ok) {
                alert(edited?.message || 'Failed to generate AI image');
                return;
            }

            window.dispatchEvent(new CustomEvent('credits-updated', { detail: { credits: data.credits } }));
            navigate(`/result/${projectId}`);
        } catch {
            alert('Something went wrong while generating image.');
        } finally {
            setIsGenerating(false);
        }
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