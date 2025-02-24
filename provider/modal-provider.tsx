"use client";

//global import
import { useEffect, useState } from "react";


//local import
import { StoreModal } from "@/components/modals/store-modal";


export const ModalProvider = () => {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if(!isMounted){
      return null;
   }

     // if we are already mounted (in the client site)
   return(
      <>
         <StoreModal/>
      </>
   )
}

// so we want to add this ModalProvider inside the app/layout.tsx. However, the "app/layout.tsx" is a server component.
// which mean that we cannot add a client to it directly to it.
// must ensure there is no hydration error


// In this case, we check that until the life cycle useEffect runs
// (which mean there something happens in the client component, there will be a null return to prevent hydration)