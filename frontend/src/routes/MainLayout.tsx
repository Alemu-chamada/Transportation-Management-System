import { Navbar } from "./Navbar";
import { AuthFooter } from "../pages/LandingPage";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
