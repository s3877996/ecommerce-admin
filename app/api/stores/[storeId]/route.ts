// 1st patch route to update the store
// 2nd delete route to delete the store
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

//PATCH method to update the stored
export async function PATCH(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {userId} = await auth();
        const body = await  req.json();

        const {name} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if(!params.storeId){
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data:{
                name
            }
        });

            return NextResponse.json(store)
    } catch(error){
        console.error('[STORE_PATCH]', error); //individual store's patch method
        return new NextResponse("Kinternal error",{status: 500});
    }
}

//DELETE method to delete the stored
export async function DELETE(
    req: Request,
    //although the rquest is not used but we can not delete it since the params is only available in the second argument of the delete function
    //can't even switch place of those
    {params}:{params:{storeId:string}}
){
    try{
        const {userId} = await auth();




        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }


        if(!params.storeId){
            return new NextResponse("Store id is required", {status: 400});
        }

        // since userId is not unique so we need to use the deleteMany instead of delete
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            },
        });

            return NextResponse.json(store)
    } catch(error){
        console.error('[STORE_DELETE]', error); //individual store's delete method
        return new NextResponse("Kinternal error",{status: 500});
    }
}