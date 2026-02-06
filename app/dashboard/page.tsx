import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
}
