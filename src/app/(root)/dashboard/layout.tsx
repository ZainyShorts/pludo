"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar/Sidebar"; 
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define the base path and whitelist of static routes under integration
  const integrationBase = "/dashboard/pludo-agents/Maverik/integration/";
  const staticPages = ["static-page", "settings", "chatbot"]; // update these with your static page names

  if (pathname.startsWith(integrationBase)) {
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = "dashboard"
    segments[1] = "pludo-agents"
    segments[2] = "Maverik"
    segments[3] = "integration"
    // segments[4] = dynamic segment or static page identifier

    const pageSegment = segments[4];

    // If there's a segment and it's not one of the known static pages, skip layout.
    if (pageSegment && !staticPages.includes(pageSegment)) {
      return <>{children}</>;
    }
  }

  return ( 
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:pl-64 bg-custom-gradient">
        {children} 
      </main>
      <ToastContainer autoClose={5000} theme="dark" />
    </div>
  );
}
