"use client"
//global import
import { useEffect } from "react";

//local import
import { useStoreModal } from "../../../hooks/use-store-modal";


const  SetUpPage = () => {
    //extract onOpen isOpen state from zustand
    //const StoreModal = useStoreModal(); is a way to do but it doesn't work when using inside a useEffect
    const onOpen = useStoreModal((state) => state.onOpen)
    const isOpen = useStoreModal((state) => state.isOpen)

    useEffect(() => {
        //check if it not open (force this dialog to be always on until the use create a store)
        if(!isOpen) {
            onOpen();
        }

    }, [isOpen, onOpen]);

    return null;
  }

  export default SetUpPage;

  //using zustand for global state management (in hooks folder)