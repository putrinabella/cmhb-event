import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import "./index.css";
import { AuthProvider } from "./routes/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Suspense } from "react";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { PageHeaderProvider } from "./context/PageHeaderContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system">
    <AuthProvider>
      <PageHeaderProvider>
        <Suspense fallback={<LoadingIndicator />}>
          <RouterProvider router={router} />
        </Suspense>
      </PageHeaderProvider>
    </AuthProvider>
  </ThemeProvider>
);
