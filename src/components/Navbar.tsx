"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
	{ href: "/test-generation", label: "Create Test" },
	{ href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const closeMenu = () => setIsOpen(false);

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
					</div>
				</div>
			)}
		</header>
	);
}
