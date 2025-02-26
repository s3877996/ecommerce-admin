"use client";

// global import
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

// local import
import { ColorColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";


interface CellActionProps {
    data: ColorColumn;
}

export const CellAction: React.FC<CellActionProps> =  ({
    data,
}) => {
    // Update function
    const router = useRouter();
    const params = useParams();

    // Delete function
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);

    // Delete funtion
        //DELETE
        const onDelete = async() =>{
            try{
                setLoading(true);
                await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
                router.refresh();
                router.push(`/${params.storeId}/colors`);
                toast.success("Color deleted.");
            } catch(error){
                toast.error("Make sure you remove all products using this color first"); //safe delete mechanism
            } finally {
                setLoading(false);
                setOpen(false)
            }
        }

        // Copy function
        const onCopy = (id: string) => {
            navigator.clipboard.writeText(id);
            toast.success("Color Id copied to the clipboard");
        };
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={()=> setOpen(false)}
                onConfirm={onDelete}
                loading={loading}

            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>

                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4"/> Copy Id
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4"/> Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4"/> Delete
                </DropdownMenuItem>

            </DropdownMenuContent>

            </DropdownMenu>
        </>

    )
};