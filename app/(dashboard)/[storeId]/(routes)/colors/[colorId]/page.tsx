import prismadb from "@/lib/prismadb";

// Local import
import { ColorForm } from "./components/color-form";

const ColorPage = async ({ params }: { params: Promise<{ colorId: string }> }) => {
    const { colorId } = await params; // Await the params before accessing properties

    const color = await prismadb.color.findUnique({
        where: {
            id: colorId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color} />
            </div>
        </div>
    );
}

export default ColorPage;
