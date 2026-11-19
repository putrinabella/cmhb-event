// import { lazy, Suspense } from "react";
// import { createBrowserRouter } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import GuestRoute from "./GuestRoute";
// import ResponsiveLayout from "@/layout/ResponsiveLayout";
// import { LoadingIndicator } from "@/components/LoadingIndicator";

// function Loadable<T extends React.ComponentType<any>>(
//   Component: React.LazyExoticComponent<T>
// ) {
//   return function WrappedLoadable(props: React.ComponentProps<T>) {
//     return (
//       <Suspense fallback={<LoadingIndicator />}>
//         <Component {...props} />
//       </Suspense>
//     );
//   };
// }

// const ProfileLayout = Loadable(lazy(() => import("@/layout/ProfileLayout")));
// const EventLayout = Loadable(lazy(() => import("@/layout/EventLayout")));

// const LoginPage = Loadable(lazy(() => import("@/pages/auth/LoginPage")));
// const NotFoundPage = Loadable(lazy(() => import("@/pages/error/NotFoundPage")));

// const EventFormPage = Loadable(
//   lazy(() => import("@/pages/desktop/EventFormPage"))
// );

// const EventDetailPage = Loadable(
//   lazy(() => import("@/pages/desktop/EventDetailPage"))
// );
// const EventCardDetailPage = Loadable(
//   lazy(() => import("@/pages/desktop/CardsDetailPage"))
// );
// const CardFormPage = Loadable(
//   lazy(() => import("@/pages/desktop/CardFormPage"))
// );

// const ParticipantFormPage = Loadable(
//   lazy(() => import("@/pages/desktop/ParticipantFormPage"))
// );

// const CardPresentationPage = Loadable(
//   lazy(() => import("@/pages/desktop/CardPresentationPage"))
// );
// const DashboardPage = Loadable(
//   lazy(() => import("@/pages/desktop/DashboardPage"))
// );

// const router = createBrowserRouter([
//   {
//     element: <GuestRoute />,
//     children: [
//       { path: "/", element: <LoginPage /> },
//       { path: "/login", element: <LoginPage /> },
//     ],
//   },
//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         path: "/",

//         element: <ResponsiveLayout />,
//         children: [
//           { path: "dashboard", element: <DashboardPage /> },

//           { path: "events", element: <EventLayout /> },
//           { path: "events/create", element: <EventFormPage /> },
//           { path: "events/edit/:id", element: <EventFormPage /> },
//           { path: "events/detail/:id", element: <EventDetailPage /> },
//           {
//             path: "events/:eventId/card/detail/:cardId",
//             element: <EventCardDetailPage />,
//           },
//           {
//             path: "events/:eventId/card/create",
//             element: <CardFormPage />,
//           },
//           {
//             path: "events/:eventId/card/edit/:cardId",
//             element: <CardFormPage />,
//           },
//           {
//             path: "events/:eventId/participant/create",
//             element: <ParticipantFormPage />,
//           },
//           {
//             path: "events/:eventId/participant/edit/:participantId",
//             element: <ParticipantFormPage />,
//           },
//           { path: "profile", element: <ProfileLayout /> },
//           { path: "404", element: <NotFoundPage /> },
//           { path: "*", element: <NotFoundPage /> },
//         ],
//       },
//     ],
//   },
//   {
//     path: "events/:eventId/card/:cardId/presentation",
//     element: <CardPresentationPage />,
//   },
// ]);

// export default router;
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import ResponsiveLayout from "@/layout/ResponsiveLayout";
import { LoadingIndicator } from "@/components/LoadingIndicator";

function Loadable<T extends React.ComponentType<any>>(
  Component: React.LazyExoticComponent<T>
) {
  return function WrappedLoadable(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<LoadingIndicator />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Layout components - load first
const ProfileLayout = Loadable(lazy(() => import("@/layout/ProfileLayout")));
const EventLayout = Loadable(lazy(() => import("@/layout/EventLayout")));

// Auth pages
const LoginPage = Loadable(lazy(() => import("@/pages/auth/LoginPage")));

// Error pages
const NotFoundPage = Loadable(lazy(() => import("@/pages/error/NotFoundPage")));

// Dashboard - optimized
const DashboardPage = Loadable(
  lazy(() =>
    import("@/pages/desktop/DashboardPage").then((module) => {
      // Preload after initial load
      return { default: module.default };
    })
  )
);

// Event pages - grouped for better code splitting
const EventFormPage = Loadable(
  lazy(() => import("@/pages/desktop/EventFormPage"))
);
const EventDetailPage = Loadable(
  lazy(() => import("@/pages/desktop/EventDetailPage"))
);
const EventCardDetailPage = Loadable(
  lazy(() => import("@/pages/desktop/CardsDetailPage"))
);

// Form pages - can be loaded on demand
const CardFormPage = Loadable(
  lazy(() => import("@/pages/desktop/CardFormPage"))
);
const ParticipantFormPage = Loadable(
  lazy(() => import("@/pages/desktop/ParticipantFormPage"))
);

// Presentation - separate bundle (fullscreen mode)
const CardPresentationPage = Loadable(
  lazy(() => import("@/pages/desktop/CardPresentationPage"))
);

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <ResponsiveLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "events",
            element: <EventLayout />,
          },
          {
            path: "events/create",
            element: <EventFormPage />,
          },
          {
            path: "events/edit/:id",
            element: <EventFormPage />,
          },
          {
            path: "events/detail/:id",
            element: <EventDetailPage />,
          },
          {
            path: "events/:eventId/card/detail/:cardId",
            element: <EventCardDetailPage />,
          },
          {
            path: "events/:eventId/card/create",
            element: <CardFormPage />,
          },
          {
            path: "events/:eventId/card/edit/:cardId",
            element: <CardFormPage />,
          },
          {
            path: "events/:eventId/participant/create",
            element: <ParticipantFormPage />,
          },
          {
            path: "events/:eventId/participant/edit/:participantId",
            element: <ParticipantFormPage />,
          },
          {
            path: "profile",
            element: <ProfileLayout />,
          },
        ],
      },
    ],
  },
  // Separate route for fullscreen presentation
  {
    path: "events/:eventId/card/:cardId/presentation",
    element: <CardPresentationPage />,
  },
  // Catch all 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
