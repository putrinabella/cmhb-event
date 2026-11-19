import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const isMobile = useIsMobile();

  const displayedItems = React.useMemo(() => {
    if (!isMobile || items.length <= 2) return items;
    // hanya ambil item pertama dan terakhir
    return [items[0], { label: "…", path: undefined }, items[items.length - 1]];
  }, [items, isMobile]);

  return (
    <nav
      className={`
        breadcrumbs text-base-content overflow-x-auto whitespace-nowrap m-0 p-0
        ${isMobile ? "text-sm" : ""}
        ${className}
      `}
      aria-label="Breadcrumb"
    >
      <ul
        className={`
          flex gap-2 items-center
          ${isMobile ? "gap-1" : "gap-2"}
        `}
      >
        {displayedItems.map((item, index) => {
          const isEllipsis = item.label === "…";
          const isLast = index === displayedItems.length - 1;

          return (
            <li key={index} className="flex-shrink-0">
              {isEllipsis ? (
                <span className="text-base-content/60 select-none">…</span>
              ) : !isLast && item.path ? (
                <Link
                  to={item.path}
                  className="hover:font-semibold no-underline hover:no-underline transition-colors decoration-transparent"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-base-content no-underline hover:no-underline transition-colors decoration-transparent cursor-default">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
