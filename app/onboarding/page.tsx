import { Header } from "@/components/shared/header";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <OnboardingForm />
      </main>
    </div>
  );
}
