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

  const buttonText = mode.startsWith("system")
    ? "View Chart"
    : "Back to System";
  const href = mode.startsWith("system") ? "/work/chart" : "/work/system";
  const header = mode.startsWith("system") ? "System" : "Chart";

  return (
    <div className="flex flex-col items-center justify-center px-8 relative">
      <div className="flex absolute top-0 left-4 items-center gap-4">
        <h1 className="text-xl font-bold my-6">{`Work (${header})`}</h1>
        <a href={href}>
          <Button variant="outline">{buttonText}</Button>
        </a>
      </div>
      {children}
    </div>
  );
}
