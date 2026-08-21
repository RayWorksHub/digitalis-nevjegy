"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ContactRound, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Áttekintés", mobileLabel: "Áttekintés", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Névjegy szerkesztése", mobileLabel: "Szerkesztés", icon: ContactRound },
  { href: "/dashboard/analytics", label: "Statisztikák", mobileLabel: "Statisztika", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Beállítások", mobileLabel: "Beállítások", icon: Settings }
];

function useSignOut() {
  const router = useRouter();

  return async () => {
    if (!isDemoMode()) await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  };
}

export function DashboardNav() {
  const pathname = usePathname();
  const signOut = useSignOut();

  return (
    <>
      <nav className="dashboard-nav" aria-label="Vezérlőpult navigáció">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return <Link href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} key={href}><Icon size={19} /><span>{label}</span></Link>;
        })}
      </nav>
      <button className="dashboard-signout" type="button" onClick={signOut}><LogOut size={18} /> Kijelentkezés</button>
    </>
  );
}

export function DashboardMobileHeaderAction() {
  const signOut = useSignOut();

  return (
    <button className="dashboard-mobile-signout" type="button" onClick={signOut} aria-label="Kijelentkezés">
      <LogOut size={19} />
    </button>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="dashboard-mobile-nav" aria-label="Mobil vezérlőpult navigáció">
      {items.map(({ href, mobileLabel, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} key={href}>
            <Icon size={20} />
            <span>{mobileLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
