//global import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

//local import
import prismadb from "@/lib/prismadb";


export async function POST(
    req: Request,
) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const {name} = body;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        const store =  await prismadb.store.create({
            data:{
                name,
                userId
            }
        });

        // Return the store data on successful creation
        return NextResponse.json(store); // Or return NextResponse.json({ store }); for better structure

    } catch (error){
        console.error('[STORES_POST]', error); // Use console.error for errors
        return new NextResponse("Internal error", {status: 500});
    }
}