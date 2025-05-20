"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
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

export default function Navbar() {
  //const { data: session }: any = useSession();

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
          {/* {!session ? (
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
              <span className="text-sm hidden md:block text-slate-600 dark:text-slate-400">
                {session.user?.email}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={`${session.user?.name || "User"}'s profile`}
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0] || "U"}
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
          )} */}
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden md:block text-slate-600 dark:text-slate-400">
              {/* {session.user?.email} */}email
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      // src={session.user?.image || ""}
                      src=""
                      alt=""
                      // alt={`${session.user?.name || "User"}'s profile`}
                    />
                    <AvatarFallback>
                      {/* {session.user?.name?.[0] || "U"} */}"U"
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
          {/* {!session && (
            <Link href="/login" className="flex flex-col items-center text-sm">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )} */}
          <Link href="/login" className="flex flex-col items-center text-sm">
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
