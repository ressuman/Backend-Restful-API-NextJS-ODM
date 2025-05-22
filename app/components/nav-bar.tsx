"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  ChevronDown,
  HomeIcon,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Navbar() {
  const { data: session } = useSession();

  // Function to get user initials from username or name
  const getUserInitials = () => {
    if (session?.user?.username) {
      return session.user.username[0].toUpperCase();
    } else if (session?.user?.name) {
      // Get initials from full name if available
      const nameParts = session.user.name.split(" ");
      if (nameParts.length > 1) {
        return (
          nameParts[0][0] + nameParts[nameParts.length - 1][0]
        ).toUpperCase();
      }
      return session.user.name[0].toUpperCase();
    }
    // Fallback to email initial or 'U'
    return session?.user?.email?.[0].toUpperCase() || "U";
  };

  // Get the display name - prefer username, fall back to name or email
  const displayName =
    session?.user?.username || session?.user?.name || session?.user?.email;

  return (
    <nav className="py-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center">
        {/* Logo and left side navigation */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <HomeIcon className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl hidden sm:inline">MyApp</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white dark:bg-slate-950 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:dark:bg-slate-800 focus:bg-slate-100 focus:dark:bg-slate-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100 data-[active]:dark:bg-slate-800">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side with auth and theme toggle */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          {!session ? (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Register</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {session.user?.username || session.user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  {session.user?.email}
                </p>
              </div>{" "}
              <div className="hidden md:block">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {session.user?.username || session.user?.name || "User"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="flex justify-between space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          {session.user?.username ||
                            session.user?.name ||
                            "User"}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {session.user?.email}
                        </p>
                        <div className="flex items-center pt-2">
                          <Link href="/profile">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        // alt={`${session.user?.name || "User"}'s profile`}
                        alt={`${displayName}'s profile`}
                      />
                      <AvatarFallback>
                        {/* {session.user?.name?.[0] || "U"} */}
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-center mt-4">
        <div className="flex space-x-6 border-t pt-4 w-full justify-center">
          <Link href="/" className="flex flex-col items-center text-sm">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-sm"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          {!session && (
            <Link href="/login" className="flex flex-col items-center text-sm">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
