import { Footer } from "./footer";
import { LandingHeader } from "./landing-header";

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <div className="flex flex-col bg-background h-screen">
      <LandingHeader />
      <main className="flex-1 max-w-7xl mx-auto">{children}</main>
      <Footer />
    </div>
  )
}

export default ClientLayout;