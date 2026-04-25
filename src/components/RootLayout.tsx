"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDE_NAVBAR_ROUTES = new Set(["/auth/login", "/auth/register"]);

type RootLayoutProps = {
	children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
	const pathname = usePathname();
	const shouldHideNavbar = pathname ? HIDE_NAVBAR_ROUTES.has(pathname) : false;

	return (
		<>
			{!shouldHideNavbar && <Navbar />}
			<main className="flex-1">{children}</main>
		</>
	);
}
