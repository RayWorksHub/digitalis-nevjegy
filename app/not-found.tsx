import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Logo />
      <p className="not-found-code">404</p>
      <h1>Ez a névjegy nem található.</h1>
      <p>Lehet, hogy a tulajdonosa priváttá tette, törölte, vagy a hivatkozás elgépelést tartalmaz.</p>
      <Link className="button button-primary" href="/"><ArrowLeft size={18} /> Vissza a kezdőlapra</Link>
    </main>
  );
}
