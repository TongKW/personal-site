import { Button } from "@/components/ui/button";
// import { usePathname } from "next/navigation";
import { headers } from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const requestUrl = headersList.get("x-url") || "";
  const pathSegments = requestUrl.split("/");
  const mode = pathSegments[pathSegments.length - 1];

  const buttonText = mode === "system" ? "View Chart" : "Back to System";
  const href = mode === "system" ? "/work/chart" : "/work/system";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center w-full flex-1 px-20 text-center">
        <div className="flex items-start w-full items-center gap-4">
          <h1 className="text-3xl font-bold my-6">{`Work System`}</h1>
          <a href={href}>
            <Button variant="outline">{buttonText}</Button>
          </a>
        </div>
        {children}
      </main>
    </div>
  );
}
