import { lazy, Suspense } from "react";
import { useAuth } from "@/routes/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useEvents } from "@/hooks/use-events";

const EventsPage = lazy(() => import("@/pages/desktop/EventsPage"));
// const MobileDashboardPage = lazy(() => import("@/pages/mobile/DashboardPage"));

export default function HomeLayout() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const {
    data: events,
    loading,
    error,
    page,
    setPage,
    total,
    lastPage,
    refetch,
  } = useEvents(1);

  if (!user) return <LoadingIndicator />;

  const sharedProps = {
    user,
    events,
    loading,
    error,
    page,
    lastPage,
    total,
    onPageChange: setPage,
    refetch,
  };

  return (
    <Suspense fallback={<LoadingIndicator />}>
      {isMobile ? (
        <EventsPage {...sharedProps} />
      ) : (
        <EventsPage {...sharedProps} />
      )}
    </Suspense>
  );
}
