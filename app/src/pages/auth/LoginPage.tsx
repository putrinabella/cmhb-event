import type { SubmitHandler } from "react-hook-form";
import AuthLayout from "@/layout/AuthLayout";
import { FormWrapper } from "@/components/FormWrapper";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/use-login";
import { EmailField } from "@/components/form/EmailField";
import { PasswordField } from "@/components/form/PasswordField";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { loginUser } = useLogin();

  const handleLoginSubmit: SubmitHandler<LoginFormValues> = (data) =>
    loginUser(data.email, data.password);

  return (
    <AuthLayout
      title="Login"
      subtitle="Masukkan email dan kata sandi untuk masuk."
    >
      <FormWrapper<LoginFormValues>
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleLoginSubmit}
      >
        {({ control }) => (
          <div className="space-y-4">
            <EmailField control={control} />
            <PasswordField control={control} />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-content hover:bg-primary-focus"
            >
              Masuk
            </Button>
          </div>
        )}
      </FormWrapper>
    </AuthLayout>
  );
}
