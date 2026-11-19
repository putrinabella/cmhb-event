import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLogout } from "@/hooks/auth/use-logout";

interface LogoutButtonProps {
  handleLogout?: () => void;
  variant?: "full" | "icon";
}

export default function LogoutButton({
  handleLogout,
  variant = "full",
}: LogoutButtonProps) {
  const { handleLogout: defaultLogout } = useLogout();

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout ?? defaultLogout}
        className="flex flex-col items-center relative group"
      >
        <div className="flex items-center justify-center text-base-content/60 hover:text-primary transition-colors">
          <LogOut className="size-[1.4em]" />
        </div>
        <span className="text-[0.7rem] mt-1 text-base-content/70 group-hover:text-primary transition-colors">
          Logout
        </span>
      </button>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleLogout ?? defaultLogout}
        size="lg"
        className="
          relative
          mt-4 w-full
          px-6 py-3
          font-semibold tracking-wide
          rounded-lg
          bg-gradient-to-r from-primary to-primary/80
          text-primary-content
          shadow-md
          hover:from-primary/90 hover:to-primary/70
          hover:shadow-lg
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-primary/30
          flex items-center justify-center
        "
      >
        <LogOut className="w-5 h-5 absolute left-4" strokeWidth={3} />
        Logout
      </Button>
    </motion.div>
  );
}
