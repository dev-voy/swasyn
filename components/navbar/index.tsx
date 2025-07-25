"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const navLinks = [
    { name: "Services", slug: "/#services" },
    { name: "Doctors", slug: "/doctors" },
    { name: "About", slug: "/#about" },
  ];
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">Swasyn</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.slug}
              href={link.slug}
              className={cn(
                "transition-colors",
                pathname == link.slug
                  ? "text-blue-600 hover:text-gray-600 font-semibold"
                  : "hover:text-blue-600 text-gray-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          {session ? (
            <Link href="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
