import { Link, NavLink, useLocation } from "react-router-dom";
import { Map, Users, Receipt, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/participants", label: "Peserta", icon: Users },
  { path: "/trips", label: "Trip", icon: Map },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 p-1 items-center justify-center rounded-full bg-green-800 text-primary-foreground">
            <img src="/KTM-circle.png" />
          </div>
          <span className="text-xl font-bold text-foreground">TourSplit</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"} // 🔑 penting
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
