"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";

function getInitials(name?: string | null) {
	if (!name) return "U";
	const parts = name.trim().split(" ").filter(Boolean);
	if (parts.length === 0) return "U";
	if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
	return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const { user, logout, loading } = useAuth();

	const closeMenu = () => setIsOpen(false);

	const canCreateTest = user?.role === "educator" || user?.role === "admin";

	const navLinks = [
		...(canCreateTest ? [{ href: "/create-test", label: "Create Test" }] : []),
		...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
	];

	const handleLogout = async () => {
		try {
			await logout();
			closeMenu();
			router.replace("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const initials = getInitials(user?.displayName);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-10">
					<Link
						href="/"
						className="text-xl font-extrabold tracking-tight text-slate-900"
						onClick={closeMenu}
					>
						HireFlow
					</Link>

					<div className="hidden items-center gap-6 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<div className="hidden items-center gap-3 md:flex">
					{user ? (
						<>
							<div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
									{initials}
								</div>
								<span className="max-w-[160px] truncate text-sm font-medium text-slate-700">
									{user.displayName || user.email}
								</span>
							</div>
							<button
								type="button"
								onClick={handleLogout}
								disabled={loading}
								className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href="/auth/login"
								className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
							>
								Login
							</Link>
							<Link
								href="/auth/register"
								className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
							>
								Get Started
							</Link>
						</>
					)}
				</div>

				<button
					type="button"
					className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
					aria-label="Toggle menu"
					aria-expanded={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
				>
					<svg
						className="h-6 w-6"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						{isOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>
			</nav>

			{isOpen && (
				<div className="border-t border-slate-200 bg-white md:hidden">
					<div className="space-y-1 px-4 py-4 sm:px-6">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={closeMenu}
								className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
							>
								{link.label}
							</Link>
						))}
						{user ? (
							<div className="mt-3 space-y-2">
								<div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
										{initials}
									</div>
									<span className="truncate text-sm font-medium text-slate-700">
										{user.displayName || user.email}
									</span>
								</div>
								<button
									type="button"
									onClick={handleLogout}
									disabled={loading}
									className="w-full rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 disabled:opacity-60"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="mt-3 grid grid-cols-2 gap-2">
								<Link
									href="/auth/login"
									onClick={closeMenu}
									className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
								>
									Login
								</Link>
								<Link
									href="/auth/register"
									onClick={closeMenu}
									className="rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white"
								>
									Get Started
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
