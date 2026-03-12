import { createRoot } from 'react-dom/client'
import type { ComponentType, PropsWithChildren } from 'react'
import './index.css'
import App from './App'

import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'

const AppClerkProvider = ClerkProvider as unknown as ComponentType<PropsWithChildren<{ afterSignOutUrl?: string; appearance?: unknown; localization?: unknown }>>;

createRoot(document.getElementById('root')! as HTMLElement).render(
  
      
   <BrowserRouter>
         <AppClerkProvider
            afterSignOutUrl="/"
            localization={{
               signIn: {
                  start: {
                     title: 'Sign in to UGC-ads',
                     subtitle: 'Welcome back! Please sign in to continue',
                  },
               },
            }}
         >
            <App />
         </AppClerkProvider>
   </BrowserRouter>
)


