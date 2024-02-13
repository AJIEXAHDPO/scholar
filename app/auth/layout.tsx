import { checkAuth } from "@/server/auth";
import { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
    await checkAuth();
    return <main>
        <div className="page">{children}</div>
    </main>
}