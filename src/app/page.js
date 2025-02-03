import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Devnito Web Mentorship</h1>
      <Link
        className="text-blue-500 underline mt-4 block"
        href="/teacher/dashboard"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
