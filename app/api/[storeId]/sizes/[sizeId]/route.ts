// 1st patch route to update the store
// 2nd delete route to delete the store
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// GET a single size
export async function GET(
    req: Request,
    context: Promise<{ params: { sizedId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { sizedId } = params;

        if (!sizedId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: { id: sizedId },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.error("[SIZE_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PATCH to update a size
export async function PATCH(
    req: Request,
    context: Promise<{ params: { storeId: string; sizeId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { storeId, sizeId } = params;

        const { userId } = await auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!name) return new NextResponse("Size name is required", { status: 400 });
        if (!value) return new NextResponse("Size value is required", { status: 400 });
        if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Update the size
        const size = await prismadb.size.updateMany({
            where: { id: sizeId },
            data: { name, value },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.error("[SIZE_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE a size
export async function DELETE(
    req: Request,
    context: Promise<{ params: { storeId: string; sizeId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { storeId, sizeId } = params;

        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Delete the size
        const deletedSize = await prismadb.size.deleteMany({
            where: { id: sizeId },
        });

        return NextResponse.json(deletedSize);
    } catch (error) {
        console.error("[SIZE_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


