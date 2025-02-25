import prismadb from "@/lib/prismadb";

// Local import
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string; storeId: string } }) => {
    // Directly access params, no need for await here
    const { categoryId, storeId } = params;

    const category = await prismadb.category.findUnique({
        where: {
        id: categoryId, // Use the resolved categoryId
        },
    });

    const billboards = await prismadb.billboard.findMany({
        where: {
        storeId: storeId, // Use the resolved storeId
        },
    });

    return (
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm initialData={category} billboards={billboards}/>
        </div>
        </div>
    );
};

export default CategoryPage;