//global import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

//local import
import prismadb from "@/lib/prismadb";


export async function POST(
    req: Request,
    { params }: { params: {storeId: string } }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const {name, billboardId} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if(!billboardId){
            return new NextResponse("Billboard ID is required", {status: 400});
        }

        //check if by chance there are any storeId
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400});
        }

        // find the store pass by the storeId
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        });

        //Prevent unauthorized access (prevent the user from accessing a store that does not belong to them)
        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }

        const category =  await prismadb.category.create({
            data:{
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        // Return the store data on successful creation
        return NextResponse.json(category); // Or return NextResponse.json({ category }); for better structure

    } catch (error){
        console.error('[CATEGORIES_POST]', error); // Use console.error for errors
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function GET(
    req: Request,
    { params }: { params: {storeId: string } }
) {
    try {
        //check if by chance there are any storeId
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400});
        }

        const categories =  await prismadb.category.findMany({
            where:{
                storeId: params.storeId,
            },
        });

        // Return the store data on successful creation
        return NextResponse.json(categories); // Or return NextResponse.json({ categories }); for better structure

    } catch (error){
        console.error('[CATEGORIES_GET]', error); // Use console.error for errors
        return new NextResponse("Internal error", {status: 500});
    }
}