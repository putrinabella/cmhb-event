import { LoadingIndicator } from "@/components/LoadingIndicator";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { usePageHeader } from "@/context/PageHeaderContext";
import { useAuth } from "@/routes/AuthContext";
import { User } from "lucide-react";
import { useEffect } from "react";

export default function ProfileDekstopPage() {
  const { user } = useAuth();

  if (!user) {
    return <LoadingIndicator />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10">
        <p className="text-lg font-medium text-error">
          Data user tidak ditemukan.
        </p>
        <LogoutButton />
      </div>
    );
  }
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: "Profil", path: "/profile" },
      ],
      icon: User,
      title: "Profil Pengguna",
      description: "Kelola akun dan profil Anda.",
    });
  }, [setHeader]);

  const userFields = [
    { label: "Email", value: user.email },
    { label: "Role", value: user.role },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full">
        <div className="order-2 lg:order-1 lg:col-span-8 p-0 m-0 space-y-4">
          <div className="bg-base-100 border border-primary/20 rounded-2xl  md:shadow-md h-fit">
            <div className="sticky top-0 z-20 border-b-2 border-primary/20 bg-primary/20 rounded-t-xl backdrop-blur-3xl">
              <h2 className="text-sm lg:text-base font-bold text-center text-base-content py-2">
                Profil
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 m-4  ">
              <div className="flex-1 flex-col justify-center space-y-8 h-[60vh] overflow-y-auto">
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {userFields.map(
                      (field, i) =>
                        field.value && (
                          <div
                            key={i}
                            className="flex items-start gap-3 bg-base-200/50 p-3 rounded-lg hover:bg-base-300/50 transition"
                          >
                            <div>
                              <p className="text-sm text-base-content/60">
                                {field.label}
                              </p>
                              <p className="font-medium text-base-content break-words">
                                {field.value}
                              </p>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-2 flex flex-col">
          <div className="bg-base-100 border border-primary/20 rounded-2xl md:shadow-md h-[50vh]">
            <div className="sticky top-0 z-20 border-b-2 border-primary/20 bg-primary/20 rounded-t-xl backdrop-blur-3xl">
              <h2 className="text-sm lg:text-base font-bold text-center text-base-content py-2">
                Tema
              </h2>
            </div>
            <div className="p-2 md:p-4 overflow-y-auto">
              <div className="m-0 text-base-content/80 h-[40vh]">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="mt-0">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
