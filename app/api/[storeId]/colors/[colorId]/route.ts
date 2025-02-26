// 1st patch route to update the store
// 2nd delete route to delete the store
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// GET a single Color
export async function GET(
    req: Request,
    context: Promise<{ params: { colorId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { colorId } = params;

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: { id: colorId },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error("[COLOR_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PATCH to update a Color
export async function PATCH(
    req: Request,
    context: Promise<{ params: { storeId: string; colorId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { storeId, colorId } = params;

        const { userId } = await auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!name) return new NextResponse("Color name is required", { status: 400 });
        if (!value) return new NextResponse("Color value is required", { status: 400 });
        if (!colorId) return new NextResponse("Color ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Update the Color
        const color = await prismadb.color.updateMany({
            where: { id: colorId },
            data: { name, value },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error("[COLOR_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE a Color
export async function DELETE(
    req: Request,
    context: Promise<{ params: { storeId: string; colorId: string } }>
) {
    try {
        const { params } = await context; // Await context before accessing params
        const { storeId, colorId } = params;

        const { userId } = await auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!colorId) return new NextResponse("Color ID is required", { status: 400 });

        // Verify store ownership
        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Delete the Color
        const deletedColor = await prismadb.color.deleteMany({
            where: { id: colorId },
        });

        return NextResponse.json(deletedColor);
    } catch (error) {
        console.error("[COLOR_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


