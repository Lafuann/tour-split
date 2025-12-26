import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 min-h-full bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40" />

      <Header />
      <main className="container py-6">{children}</main>
    </div>
  );
};
