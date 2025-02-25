//dont put in the components/ui folder since it is not a reusable component (just for the dashboard layout)

//global import
import { UserButton } from "@clerk/nextjs";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { auth} from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import prismadb from "@/lib/prismadb";

const Navbar =  async () => {
    const {userId} = await auth();

    if(!userId) {
        redirect("/sign-in")
    }

    const stores = await prismadb.store.findMany({
        where:{
            userId
        },
    });

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores}/>
                <MainNav className="mx-6"/>

                <div className="ml-auto flex items-center space-x-4">
                    <UserButton/>
                </div>
            </div>
        </div>
    )
}

export default Navbar;


//<MainNav/>
//replace "afterSignOutUrl" by "https://clerk.com/docs/upgrade-guides/core-2/react"
//As part of this change, the default URL for each of these props has been set to /, so if you are passing / explicitly to any one of the above props, that line is no longer necessary and can be removed.