import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Devnito Web Mentorship</h1>
      <div className="flex items-center gap-4">
        <Link
          className="text-blue-500 mt-4 block border-2 border-blue-500 rounded-lg px-4 py-2"
          href="/teacher"
        >
          Teacher
        </Link>
        <Link
          className="text-blue-500 mt-4 block border-2 border-blue-500 rounded-lg px-4 py-2"
          href="/student"
        >
          Student
        </Link>
      </div>
    </div>
  );
}
