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

        const {name, value} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if(!value){
            return new NextResponse("Value is required", {status: 400});
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

        const size =  await prismadb.size.create({
            data:{
                name,
                value,
                storeId: params.storeId
            }
        });

        // Return the store data on successful creation
        return NextResponse.json(size); // Or return NextResponse.json({ billboard }); for better structure

    } catch (error){
        console.error('[SIZES_POST]', error); // Use console.error for errors
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

        const sizes =  await prismadb.size.findMany({
            where:{
                storeId: params.storeId,
            },
        });

        // Return the store data on successful creation
        return NextResponse.json(sizes); // Or return NextResponse.json({ billboard }); for better structure

    } catch (error){
        console.error('[SIZES_GET]', error); // Use console.error for errors
        return new NextResponse("Internal error", {status: 500});
    }
}