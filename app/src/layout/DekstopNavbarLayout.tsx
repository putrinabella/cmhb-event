import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/routes/AuthContext";
import { useLogout } from "@/hooks/auth/use-logout";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  House,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeaderDekstop } from "@/components/PageHeader";
import { usePageHeader } from "@/context/PageHeaderContext";

export default function DashboardLayout() {
  const { user } = useAuth();
  const { handleLogout } = useLogout();
  const [collapsed, setCollapsed] = useState(true);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <House className="size-5" />,
    },
    {
      to: "/events",
      label: "Events",
      icon: <PartyPopper className="size-5" />,
    },
  ];
  const { header } = usePageHeader();
  const location = useLocation();
  // const { clearHeader } = usePageHeader();

  // useEffect(() => {
  //   clearHeader();
  // }, [location.pathname]);
  return (
    <div className="flex h-screen">
      <div
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-base-100 border-r border-base-300 flex flex-col items-start transition-all duration-300 shadow-lg`}
      >
        <div className="flex items-center justify-center px-4 py-4 border-b border-base-300 w-full h-16">
          {!collapsed ? (
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 transition-all"
            />
          ) : (
            <img
              src="/images/logocrop.ico"
              alt="Logo small"
              className="h-8 transition-all"
            />
          )}
        </div>

        <ul className="menu w-full grow p-2 gap-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary  text-primary-content font-semibold shadow-sm"
                      : "hover:bg-base-300 hover:shadow-inner"
                  }`
                }
              >
                {collapsed ? (
                  <div className="tooltip tooltip-right" data-tip={item.label}>
                    {item.icon}
                  </div>
                ) : (
                  item.icon
                )}

                {!collapsed && <span className="text-sm">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`btn btn-ghost self-center mt-1 transition-all duration-300 ${
            collapsed ? "btn-circle" : "w-auto px-3"
          }`}
          data-tip={collapsed ? "Open" : "Close"}
        >
          {collapsed ? (
            <div className="tooltip tooltip-right" data-tip="Tampilkan Sidebar">
              <ChevronRight className="size-5" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="size-5" />
              <span className="text-sm whitespace-nowrap">
                Sembunyikan Sidebar
              </span>
            </div>
          )}
        </button>
        <div className="w-full border-t border-base-300 p-3 flex flex-col items-stretch gap-3 transition-all duration-300">
          <Link
            to="/profile"
            className="flex items-center gap-3 hover:bg-base-200/60 rounded-lg transition-all duration-200"
          >
            <div className="avatar tooltip tooltip-right" data-tip="Profil">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-base-300 bg-base-200 flex items-center justify-center">
                <img
                  src="/images/user.png"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <p className="font-semibold leading-tight text-base-content">
                  {user?.email || "User"}
                </p>
                <p className="text-xs text-base-content/60">
                  {user?.role || "Role"}
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className={`btn btn-sm flex items-center gap-2 font-semibold transition-all duration-300
    ${
      collapsed
        ? "btn-error w-9 h-9 aspect-square justify-center rounded-full p-0"
        : "bg-error h-9 hover:bg-error/80 text-primary-content justify-start px-4 border-0"
    }`}
          >
            {collapsed ? (
              <div className="tooltip tooltip-right" data-tip="Logout">
                <LogOut className="size-4 text-primary-content" />
              </div>
            ) : (
              <div className="flex flex-row items-center gap-2">
                <LogOut className="size-4" />
                <span className="text-sm tracking-wide">Logout</span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="navbar bg-base-100 border-b border-base-300 px-6 grid grid-cols-3 items-center relative z-50">
          <span></span>
          <span className="text-center font-bold">
            Ciputra Mitra Hospital Banjarmasin
          </span>
          <div className="flex flex-col items-end text-sm leading-tight">
            <span className="font-medium">{formattedDate}</span>
            <span className="text-base-content/70 text-base">
              {formattedTime}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {header && <PageHeaderDekstop {...header} />}
          <Outlet key={location.pathname} />
        </div>
      </div>
    </div>
  );
}
