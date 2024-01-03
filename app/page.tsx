import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold my-6">This is my digital home.</h1>

        <div className="flex justify-center space-x-5 my-6">
          <a href="/wall">
            <Button variant="outline">Wall</Button>
          </a>
          <a href="/work">
            <Button variant="outline">Work</Button>
          </a>
          <a href="/goals">
            <Button variant="outline">Goals</Button>
          </a>
          <a href="/projects">
            <Button variant="outline">Projects</Button>
          </a>
        </div>

        <section className="self-start w-full px-20">
          <h2 className="text-4xl font-semibold mt-12 mb-4">About Me</h2>
          <p className="text-lg">{`It's a secret.`}</p>
        </section>
      </main>
    </div>
  );
}
