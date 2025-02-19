"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChartPieIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [details, setDetails] = useState();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let data = localStorage.getItem("teacher");
    if (!data && pathname === "/teacher/dashboard") {
      router.push("/teacher");
    } else if (data && pathname === "/teacher") {
      router.push("/teacher/dashboard");
    } else {
      setDetails(JSON.parse(data));
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("teacher");
    router.push("/teacher");
  };

  const navigation = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: ChartPieIcon },
    { name: "Courses", href: "/teacher/dashboard/courses", icon: BookOpenIcon },
    {
      name: "communication",
      href: "/teacher/dashboard/communication",
      icon: ChatBubbleLeftIcon,
    },
    {
      name: "Revenue",
      href: "/teacher/dashboard/revenue",
      icon: CurrencyDollarIcon,
    },
    {
      name: "Setting",
      href: "/teacher/dashboard/setting",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <>
      <div>
        {/* Mobile sidebar dialog */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="w-6 h-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center gap-2">
                  <img
                    alt="Your Company"
                    src="/logo.svg"
                    className="h-10 w-auto"
                  />
                  <h1 className="text-white">Devnito</h1>
                </div>

                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                pathname === item.href
                                  ? "bg-gray-800 text-primary"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  pathname === item.href
                                    ? "text-primary"
                                    : "text-gray-400 group-hover:text-white",
                                  "w-6 h-6 shrink-0"
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop sidebar */}
        {desktopSidebarOpen && (
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
              <div className="flex h-16 shrink-0 items-center gap-2">
                <img
                  alt="Your Company"
                  src="/logo.svg"
                  className="h-10 w-auto"
                />
                <h1 className="text-white">Devnito</h1>
                {/* Desktop sidebar close button */}
                <button
                  onClick={() => setDesktopSidebarOpen(false)}
                  className="ml-auto text-gray-400 hover:text-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? "bg-gray-800 text-primary"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                pathname === item.href
                                  ? "text-primary"
                                  : "text-gray-400 group-hover:text-white",
                                "w-6 h-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mx-auto mt-auto mb-4">
                    {details && details.name ? (
                      <div className="flex gap-4 justify-center items-center">
                        <span className="text-blue-400 text-sm">
                          {details.name}
                        </span>
                        <button
                          onClick={handleLogOut}
                          className="bg-blue-500 rounded-lg text-white px-4 py-2 text-xs hover:bg-blue-600"
                        >
                          LogOut
                        </button>
                      </div>
                    ) : null}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Button to open desktop sidebar when closed */}
        {!desktopSidebarOpen && (
          <div className="hidden lg:flex">
            <button
              onClick={() => setDesktopSidebarOpen(true)}
              className="fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded-md text-gray-400 hover:text-white"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex items-center gap-x-2 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="w-6 h-6" />
          </button>

          <div className="flex-1 text-sm font-semibold text-white">
            Dashboard
          </div>

          <div className="flex gap-x-4">
            {details && details.name ? (
              <div className="flex gap-2 justify-center items-center">
                <span className="text-blue-400 text-xs sm:text-sm">
                  {details.name}
                </span>
                <button
                  onClick={handleLogOut}
                  className="bg-blue-500 rounded-lg text-white px-2 sm:px-4 py-2 text-xs hover:bg-blue-600"
                >
                  LogOut
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Main content area */}
        <main className={desktopSidebarOpen ? "lg:pl-72" : ""}>
          <div>{children}</div>
        </main>
      </div>
    </>
  );
}
