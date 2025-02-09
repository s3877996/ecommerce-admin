import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;  // Update params to Promise type for Nextjs15
};

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const { storeId } = await params;  // Await params to get storeId

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId
    }
  });

  

  return (
    <div>Active Store: {store?.name}</div>
  );
};

export default DashboardPage;


// In Next.js 15, the params object in dynamic routes is now asynchronous.
// This means you need to await it to retrieve the dynamic values like storeId