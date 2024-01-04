import AuthTestArea from "@/app/secret-login/test/Test";

export default function SecretLogin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-1/3">
        <AuthTestArea />
      </div>
    </div>
  );
}
