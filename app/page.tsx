import { Button } from "@/components/ui/button";
import { Ring } from "@/components/ui/ring";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center  py-2">
      <main className="flex flex-col items-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold my-6">This is my digital home.</h1>
        {/* <Ring progress={120} color={"text-green-500"} shimmer /> */}

        {/* <section className="self-start w-full px-20">
          <h2 className="text-4xl font-semibold mt-12 mb-4">About Me</h2>
          <p className="text-lg">{`iykyk.`}</p>
        </section> */}
      </main>
    </div>
  );
}
