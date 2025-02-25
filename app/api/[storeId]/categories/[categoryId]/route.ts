// 1st patch route to update the store
// 2nd delete route to delete the store
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// GET a single billboard
export async function GET(
    req: Request,
    context: Promise<{ params: { categoryId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { categoryId } = params;

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: { id: categoryId },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PATCH to update a billboard
export async function PATCH(
    req: Request,
    context: Promise<{ params: { storeId: string; categoryId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { storeId, categoryId } = params;

        const { userId } = await auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });
        if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Update the billboard
        const category = await prismadb.category.update({
            where: { id: categoryId },
            data: { name, billboardId },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE a billboard
export async function DELETE(
    req: Request,
    context: Promise<{ params: { storeId: string; categoryId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { storeId, categoryId } = params;

        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Delete the billboard
        const deletedCategory = await prismadb.category.deleteMany({
            where: { id: categoryId },
        });

        return NextResponse.json(deletedCategory);
    } catch (error) {
        console.error("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

