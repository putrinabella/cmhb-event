import { lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingIndicator } from "@/components/LoadingIndicator";

const DashboardLayout = lazy(() => import("@/layout/DekstopNavbarLayout"));
// const PhoneLayout = lazy(() => import("@/layout/MobileNavbarLayout"));

export default function ResponsiveLayout() {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<LoadingIndicator />}>
      {isMobile ? <DashboardLayout /> : <DashboardLayout />}
    </Suspense>
  );
}
