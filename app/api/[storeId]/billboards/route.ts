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

        const {label, imageUrl} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!label){
            return new NextResponse("Label is required", {status: 400});
        }

        if(!imageUrl){
            return new NextResponse("Image URL is required", {status: 400});
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

        const billboard =  await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        // Return the store data on successful creation
        return NextResponse.json(billboard); // Or return NextResponse.json({ billboard }); for better structure

    } catch (error){
        console.error('[BILLBOARDS_POST]', error); // Use console.error for errors
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

        const billboards =  await prismadb.billboard.findMany({
            where:{
                storeId: params.storeId,
            },
        });

        // Return the store data on successful creation
        return NextResponse.json(billboards); // Or return NextResponse.json({ billboard }); for better structure

    } catch (error){
        console.error('[BILLBOARDS_GET]', error); // Use console.error for errors
        return new NextResponse("Internal error", {status: 500});
    }
}