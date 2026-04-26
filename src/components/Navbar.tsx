"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";

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

	const canCreateTest = user?.role === "recruiter";

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
		<header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
			<nav className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
				<div className="flex items-center">
					<Link
						href="/"
						className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-4 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:border-slate-300"
						onClick={closeMenu}
					>
						<Image
							src="/assests/images/logo.png"
							alt="HireFlow Logo"
							width={52}
							height={52}
						/>
						<span className="text-lg font-extrabold tracking-tight text-slate-900">
							HireFlow
						</span>
					</Link>
				</div>

				<div className="hidden justify-center md:flex">
					<div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
							>
								{link.label}
							</Link>
						))}
						{navLinks.length === 0 ? (
							<span className="px-4 py-2 text-sm font-medium text-slate-400">
								Welcome
							</span>
						) : null}
					</div>
				</div>

				<div className="hidden items-center justify-end gap-3 md:flex">
					{user ? (
						<>
							<div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/95 px-3 py-2 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#312e81)] text-xs font-semibold text-white">
									{initials}
								</div>
								<div className="min-w-0">
									<p className="max-w-44 truncate text-sm font-semibold text-slate-900">
										{user.displayName || user.email}
									</p>
									<p className="max-w-44 truncate text-xs uppercase tracking-[0.16em] text-slate-500">
										{user.role}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={handleLogout}
								disabled={loading}
								className="rounded-full border border-slate-300 bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href="/auth/login"
								className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
							>
								Login
							</Link>
							<Link
								href="/auth/register"
								className="rounded-full bg-[linear-gradient(135deg,#0f172a,#312e81,#0891b2)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(49,46,129,0.26)] transition hover:brightness-110"
							>
								Get Started
							</Link>
						</>
					)}
				</div>

				<button
					type="button"
					className="inline-flex items-center justify-center justify-self-end rounded-full border border-slate-200 bg-white/90 p-3 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:bg-slate-100 md:hidden"
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
				<div className="border-t border-slate-200/80 bg-white/95 backdrop-blur md:hidden">
					<div className="space-y-2 px-4 py-4 sm:px-6">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={closeMenu}
								className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
							>
								{link.label}
							</Link>
						))}
						{user ? (
							<div className="mt-3 space-y-2">
								<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#312e81)] text-xs font-semibold text-white">
										{initials}
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-slate-900">
											{user.displayName || user.email}
										</p>
										<p className="truncate text-xs uppercase tracking-[0.16em] text-slate-500">
											{user.role}
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={handleLogout}
									disabled={loading}
									className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 disabled:opacity-60"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="mt-3 grid grid-cols-2 gap-2">
								<Link
									href="/auth/login"
									onClick={closeMenu}
									className="rounded-2xl border border-slate-300 px-3 py-3 text-center text-sm font-semibold text-slate-700"
								>
									Login
								</Link>
								<Link
									href="/auth/register"
									onClick={closeMenu}
									className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#312e81,#0891b2)] px-3 py-3 text-center text-sm font-semibold text-white"
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
