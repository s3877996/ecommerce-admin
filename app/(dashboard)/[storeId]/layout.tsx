import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// local imports
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ storeId: string }> 
}) {
    // Await the auth call to get the userId
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Await the params to access storeId
    const { storeId } = await params; 

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
