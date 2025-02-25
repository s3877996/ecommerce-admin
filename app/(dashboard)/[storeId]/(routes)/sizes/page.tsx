import {format} from "date-fns";
import prismadb from "@/lib/prismadb";
import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage =  async ({
    params
}:{
    params:{
        storeId: string;
    }
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    });


    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        // convert date to string
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <SizesClient data={formattedSizes}/>
            </div>
        </div>
    );
}

export default SizesPage;