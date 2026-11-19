import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface StatItem {
  label: string;
  value: string | number;
}

export interface PageHeaderData {
  breadcrumb: BreadcrumbItem[];
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLink?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  stats?: StatItem[];
  back?: string;
}

interface PageHeaderContextValue {
  header: PageHeaderData | null;
  setHeader: React.Dispatch<React.SetStateAction<PageHeaderData | null>>;
  clearHeader: () => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue | undefined>(
  undefined
);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<PageHeaderData | null>(null);

  const clearHeader = useCallback(() => setHeader(null), []);

  const value = useMemo(
    () => ({ header, setHeader, clearHeader }),
    [header, clearHeader]
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider");
  }
  return context;
}
