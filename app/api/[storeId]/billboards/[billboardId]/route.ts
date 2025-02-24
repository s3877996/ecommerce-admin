// 1st patch route to update the store
// 2nd delete route to delete the store
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// GET a single billboard
export async function GET(
    req: Request,
    context: Promise<{ params: { billboardId: string } }>
) {
    try {
        const { params } = await context; // ✅ Await context before accessing params
        const { billboardId } = params;

        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: { id: billboardId },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[BILLBOARD_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PATCH to update a billboard
export async function PATCH(
    req: Request,
    context: Promise<{ params: { storeId: string; billboardId: string } }>
) {
    try {
        const { params } = await context; // ✅ Await context before accessing params
        const { storeId, billboardId } = params;

        const { userId } = await auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!label) return new NextResponse("Label is required", { status: 400 });
        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });
        if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Update the billboard
        const billboard = await prismadb.billboard.update({
            where: { id: billboardId },
            data: { label, imageUrl },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE a billboard
export async function DELETE(
    req: Request,
    context: Promise<{ params: { storeId: string; billboardId: string } }>
) {
    try {
        const { params } = await context; // ✅ Await context before accessing params
        const { storeId, billboardId } = params;

        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Delete the billboard
        const deletedBillboard = await prismadb.billboard.delete({
            where: { id: billboardId },
        });

        return NextResponse.json(deletedBillboard);
    } catch (error) {
        console.error("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


// export async function GET(
//     req: Request,
//     //although the rquest is not used but we can not delete it since the params is only available in the second argument of the delete function
//     //can't even switch place of those
//     { params }:{ params: { billboardId: string}}
// ){
//     try{

//         if(!params.billboardId){
//             return new NextResponse("Billboard id is required", {status: 400});
//         }

//         // since userId is not unique so we need to use the deleteMany instead of delete
//         const billboard = await prismadb.store.findUnique({
//             where: {
//                 id: params.billboardId,
//             },
//         });

//             return NextResponse.json(billboard)
//     } catch(error){
//         console.error('[BILLBOARD_GET]', error); //individual store's delete method
//         return new NextResponse("Kinternal error",{status: 500});
//     }
// };

// //PATCH method to update the stored
// export async function PATCH(
//     req: Request,
//     { params }:{ params: { storeId: string, billboardId: string}}
// ){
//     try{
//         const {userId} = await auth();
//         const body = await  req.json();

//         const {label, imageUrl} = body;

//         if(!userId){
//             return new NextResponse("Unauthenticated", {status: 401});
//         }

//         if(!label){
//             return new NextResponse("Label is required", {status: 400});
//         }

//         if(!imageUrl){
//             return new NextResponse("Image URL  is required", {status: 400});
//         }

//         if(!params.billboardId){
//             return new NextResponse("Billboard id is required", {status: 400});
//         }

//         // find the store pass by the storeId
//         const storeByUserId = await prismadb.store.findFirst({
//             where:{
//                 id: params.storeId,
//                 userId
//             }
//         });

//         //Prevent unauthorized access (prevent the user from accessing a store that does not belong to them)
//         if(!storeByUserId){
//             return new NextResponse("Unauthorized", {status: 403});
//         }

//         const billboard = await prismadb.billboard.updateMany({
//             where: {
//                 id: params.billboardId,
//             },
//             data:{
//                 label,
//                 imageUrl
//             }
//         });

//             return NextResponse.json(billboard)
//     } catch(error){
//         console.error('[BILLBOARD_PATCH]', error); //individual billboard's patch method
//         return new NextResponse("Kinternal error",{status: 500});
//     }
// };

// //DELETE method to delete the stored
// export async function DELETE(
//     req: Request,
//     //although the rquest is not used but we can not delete it since the params is only available in the second argument of the delete function
//     //can't even switch place of those
//     { params }:{ params: { storeId: string, billboardId: string}}
// ){
//     try{
//         const {userId} = await auth();


//         if(!userId){
//             return new NextResponse("Unauthenticated", {status: 401});
//         }


//         if(!params.billboardId){
//             return new NextResponse("Billboard id is required", {status: 400});
//         }


//         // find the store pass by the storeId
//         const storeByUserId = await prismadb.store.findFirst({
//             where:{
//                 id: params.storeId,
//                 userId
//             }
//         });

//         //Prevent unauthorized access (prevent the user from accessing a store that does not belong to them)
//         if(!storeByUserId){
//             return new NextResponse("Unauthorized", {status: 403});
//         }

//         // since userId is not unique so we need to use the deleteMany instead of delete
//         const billboard = await prismadb.store.deleteMany({
//             where: {
//                 id: params.billboardId,
//             },
//         });

//             return NextResponse.json(billboard)
//     } catch(error){
//         console.error('[BILLBOARD_DELETE]', error); //individual store's delete method
//         return new NextResponse("Kinternal error",{status: 500});
//     }
// };

