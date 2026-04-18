import Image from "next/image";
import { fetchTests } from "@/actions/test";

export default async function Home() {
  const tests = await fetchTests();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="text-center">
        <Image
          src="/hackprinceton.png"
          alt="HackPrinceton"
          width={300}
          height={300}
          priority
          className="mx-auto"
        />
        <h1 className="mt-6 text-6xl font-bold tracking-tight text-sky-900">
          hackprinceton
        </h1>
        <p className="mt-4 text-lg text-sky-600">
          something cool is coming
        </p>
        <ul className="mt-8 space-y-2">
          {tests.map((test) => (
            <li key={test.id} className="text-sky-800">
              {test.test_column}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
