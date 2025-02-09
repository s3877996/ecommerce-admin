// Global imports
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Local imports
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Await the params explicitly in Next.js 15
  const { storeId } = await params;

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
