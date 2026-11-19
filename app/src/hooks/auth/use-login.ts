import { useNavigate } from "react-router-dom";
import { login as loginService } from "@/services/authService";
import { useAuth } from "@/routes/AuthContext";
import { showSwal } from "@/lib/SwalHelper";
import { handleApiError } from "@/lib/ErrorHandler";

export function useLogin() {
  const navigate = useNavigate();
  const { login, setToken } = useAuth();

  const loginUser = async (email: string, password: string) => {
    try {
      const result = await loginService(email, password);

      // if (result.user.role.toLowerCase() !== "admin") {
      //   showSwal({
      //     title: "Akses Ditolak",
      //     text: "Hanya pengguna dengan role admin yang dapat login.",
      //     icon: "error",
      //   });
      //   return;
      // }

      const userData = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        token: result.token,
      };

      login(result.token, userData);
      setToken(result.token);

      showSwal({
        title: "Login Berhasil",
        text: "Selamat datang kembali!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        onClose: () => navigate("/dashboard"),
      });
    } catch (err: any) {
      await handleApiError(err, "Terjadi kesalahan dari sistem");
    }
  };

  return { loginUser };
}
