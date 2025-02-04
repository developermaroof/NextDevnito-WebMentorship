// Enable client-side rendering for this component
"use client";

// Import React hooks
import { useEffect, useState } from "react";
// Next.js navigation imports
import Link from "next/link";
import { usePathname } from "next/navigation";
// Headless UI components for dialog/modal functionality
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
// Heroicons for UI elements
import {
  Bars3Icon, // Mobile menu icon
  XMarkIcon, // Close icon
  ChartPieIcon, // Dashboard icon
  BookOpenIcon, // Courses icon
  ChatBubbleLeftIcon, // Communication icon
  CurrencyDollarIcon, // Revenue icon
  Cog6ToothIcon, // Settings icon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

// Utility function to combine class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Main layout component for dashboard
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [details, setDetails] = useState();

  const router = useRouter();
  // Get current path for active link styling
  const pathname = usePathname();

  useEffect(() => {
    let data = localStorage.getItem("teacher");
    if (!data && pathname == "/teacher/dashboard") {
      router.push("/teacher");
    } else if (data && pathname == "/teacher") {
      router.push("/teacher/dashboard");
    } else {
      setDetails(JSON.parse(data));
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("teacher");
    router.push("/teacher");
  };

  // Navigation configuration array
  const navigation = [
    {
      name: "Dashboard",
      href: "/teacher/dashboard",
      icon: ChartPieIcon, // Associated icon component
    },
    {
      name: "Courses",
      href: "/teacher/dashboard/courses",
      icon: BookOpenIcon,
    },
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
          open={sidebarOpen} // Controlled by sidebarOpen state
          onClose={setSidebarOpen} // Close handler
          className="relative z-50 lg:hidden" // Hide on desktop
        >
          {/* Backdrop for mobile sidebar */}
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          {/* Mobile sidebar container */}
          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              {/* Close button for mobile sidebar */}
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
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Mobile sidebar content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                {/* Logo section */}
                <div className="flex h-16 shrink-0 items-center gap-2">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-10 w-auto"
                  />
                  <h1 className="text-white">Devnito</h1>
                </div>

                {/* Navigation links */}
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
                                  ? "bg-gray-800 text-primary" // Active state
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white", // Inactive state
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              {/* Navigation icon with dynamic styling */}
                              <item.icon
                                className={classNames(
                                  pathname === item.href
                                    ? "text-primary"
                                    : "text-gray-400 group-hover:text-white",
                                  "size-6 shrink-0"
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
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Desktop sidebar content */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            {/* Logo section */}
            <div className="flex h-16 shrink-0 items-center gap-2">
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                className="h-10 w-auto"
              />
              <h1 className="text-white">Devnito</h1>
            </div>

            {/* Navigation links */}
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
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              pathname === item.href
                                ? "text-primary"
                                : "text-gray-400 group-hover:text-white",
                              "size-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Profile section */}
                <li className="-mx-6 mt-auto">
                  <div className="flex">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
                    >
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-800"
                      />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">Tom Cook</span>
                    </a>
                    {details && details.name ? (
                      <button
                        onClick={handleLogOut}
                        className="border-2 border-blue-500 text-white px-4"
                      >
                        LogOut
                      </button>
                    ) : null}
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          {/* Page title */}
          <div className="flex-1 text-sm/6 font-semibold text-white">
            Dashboard
          </div>

          {/* Mobile profile link */}
          <div className="flex gap-x-4">
            {details && details.name ? (
              <button
                onClick={handleLogOut}
                className="border-2 border-blue-500 text-white px-4"
              >
                LogOut
              </button>
            ) : null}

            <a href="#" className="border-2 border-blue-500">
              <span className="sr-only">Your profile</span>
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-8 rounded-full bg-gray-800"
              />
            </a>
          </div>
        </div>

        {/* Main content area */}
        <main className="lg:pl-72">
          {/* Offset for desktop sidebar */}
          <div>
            {children} {/* Page content injected here */}
          </div>
        </main>
      </div>
    </>
  );
}
