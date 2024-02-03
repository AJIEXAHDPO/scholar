import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <main>
        <div className="page">{children}</div>
    </main>
}