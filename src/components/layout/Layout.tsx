import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* <div className="min-h-screen bg-background bg-no-repeat bg-center relative">
        <div className="absolute inset-0 sm:bg-black/20" />
        <div className="relative z-10">
          <Header />
          <main className="container py-6 ">{children}</main>
        </div>
      </div> */}

      <div className="min-h-screen relative overflow-hidden bg-background">
        <div className="absolute inset-0 sm:bg-gradient-to-br sm:from-primary/40 sm:via-secondary/40 sm:to-accent/40" />

        <div className="relative z-10">
          <Header />
          <main className="container py-6 h-full sm:my-2">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};
