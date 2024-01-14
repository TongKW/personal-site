import { SupabaseEmailLoginForm } from "@/components/ui/login-form/email";

export default function SecretLogin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-1/3">
        <div className="pb-10">{`Hey, you shouldn't be here :)`}</div>
        <SupabaseEmailLoginForm /> {/** Client Component */}
      </div>
    </div>
  );
}
