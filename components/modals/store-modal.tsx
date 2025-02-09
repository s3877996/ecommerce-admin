// a reusable new modal
"use client";

//global import
import * as z from "zod"
import { useState } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios";
import toast from "react-hot-toast";

//local import
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect , useRouter } from "next/navigation";




//1.  Define a schema of a form
const formSchema = z.object({
  //The store's name require at least 1 character
  name: z.string().min(1),
});

export const StoreModal = () => {
  //add zustand to control the state
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  //fefine hooks for the form
  const form = useForm<z.infer<typeof formSchema>>({
    //add resolver
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: ""
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) =>{
    try{
      setLoading(true);
      
      const response = await axios.post('/api/stores', values);
      // Use the response Id to redirect to new group routes. 
      // then do the navigation bar
      // then setting to delete the store
      console.log(response.data);
      toast.success("Store created.")

    } catch(error){
      //better handing error using react-hot-toast
      // TODO:  create toast provider to add to the app/layout.tsx
      toast.error("Something when wrong.")
      console.log(error);
    } finally{
      setLoading(false);
      storeModal.onClose();  // Close the modal
      redirect('/');
    }
  }
  return (
    <Modal
      title="Create a store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control}
                name  = "name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled = {loading} placeholder="E-Commerce" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button
                    disabled = {loading}
                    variant="outline" 
                    onClick={storeModal.onClose}>Cancel</Button>

                  <Button disabled={loading} type="submit">Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

    </Modal>
  );
};


//model provider to make this modal available  throught out the application