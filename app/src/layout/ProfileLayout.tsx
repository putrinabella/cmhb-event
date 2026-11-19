import { lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingIndicator } from "@/components/LoadingIndicator";

const ProfileDesktopPage = lazy(() => import("@/pages/desktop/ProfilePage"));
// const ProfileMobilePage = lazy(() => import("@/pages/mobile/ProfilePage"));

export default function ProfileLayout() {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<LoadingIndicator />}>
      {isMobile ? <ProfileDesktopPage /> : <ProfileDesktopPage />}
    </Suspense>
  );
}
