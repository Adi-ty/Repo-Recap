import Logo from "@/components/logo";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Logo />
      {children}
    </div>
  );
}

export default Layout;
