// Global imports
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Fetch the latest store based on the createdAt timestamp
    const store = await prismadb.store.findFirst({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'  // Ensure you are fetching the most recently created store
        }
    });

    // Redirect to the latest store if it exists
    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>{children}</>
    );
}
