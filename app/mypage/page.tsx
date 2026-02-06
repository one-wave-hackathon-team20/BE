import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ProfileEditor } from "@/components/mypage/profile-editor";

export default function MyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProfileEditor />
      </main>
      <Footer />
    </div>
  );
}
