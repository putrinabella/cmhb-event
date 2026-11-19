import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { type LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
}

interface PageHeaderProps {
  breadcrumb?: { label: string; path: string }[];
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLink?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  stats?: StatItem[];
  back?: string;
}

export function PageHeaderDekstop({
  breadcrumb,
  icon: Icon,
  title,
  description,
  actionLink,
  actionLabel,
  actionIcon: ActionIcon,
  stats = [],
}: PageHeaderProps) {
  // Generate the correct grid class based on stats length
  const getGridCols = () => {
    if (stats.length === 1) return "grid-cols-1 sm:grid-cols-1";
    if (stats.length === 2) return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-1 sm:grid-cols-3"; // 3 or more
  };

  const gradients = [
    "from-pink-50 to-pink-100",
    "from-purple-50 to-purple-100",
    "from-pink-50 to-purple-100",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative ">
      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumb} />
        </div>
      )}

      {/* Header and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-6">
          <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-xl shadow-md">
            <Icon size={32} className="text-primary-content" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              {title}
            </h1>
            {description && <p className="text-base-content">{description}</p>}
          </div>
        </div>

        {actionLink && actionLabel && (
          <Link to={actionLink}>
            <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              {ActionIcon && <ActionIcon size={20} />}
              <span>{actionLabel}</span>
            </button>
          </Link>
        )}
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className={`mt-8 grid gap-6 ${getGridCols()}`}>
          {stats.map((s, i) => {
            const bg = gradients[i % gradients.length];
            return (
              <div
                key={i}
                className={`bg-gradient-to-br ${bg} p-6 rounded-xl transition-transform hover:scale-[1.02]`}
              >
                <p className="text-sm font-medium text-base-content mb-1 uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-base-content mt-1">
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PageHeaderMobile({
  breadcrumb,
  icon: Icon,
  title,
  description,
  actionLink,
  actionLabel,
  actionIcon: ActionIcon,
  stats = [],
}: PageHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 relative">
      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumb} />
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Icon + title */}
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-primary to-secondary p-3 sm:p-4 rounded-xl shadow-md">
            <Icon size={28} className="text-primary-content sm:size-32" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-1">
              {title}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-base-content">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action button */}
        {actionLink && actionLabel && (
          <Link to={actionLink} className="w-full sm:w-auto">
            <button className="flex justify-center sm:justify-start items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-primary-content px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base font-medium">
              {ActionIcon && <ActionIcon size={18} />}
              <span>{actionLabel}</span>
            </button>
          </Link>
        )}
      </div>

      {/* Stats Section */}
      {stats.length > 0 && <div className="p-0 m-0"></div>}
    </div>
  );
}
