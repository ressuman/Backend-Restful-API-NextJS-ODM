"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
//import { Github, Google, Search } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  FaApple,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaMicrosoft,
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your login logic here
  };

  return (
    <div className="flex justify-center my-1 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white dark:bg-slate-900"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 px-2 text-xs text-slate-500">
              OR CONTINUE WITH
            </span>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("github")}
            >
              <FaGithub size={18} />
              <span>Sign in with GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("google")}
            >
              <FcGoogle size={18} />
              <span>Sign in with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("facebook")}
            >
              <FaFacebook size={18} />
              <span>Sign in with Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("twitter")}
            >
              <FaTwitter size={18} />
              <span>Sign in with Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("linkedin")}
            >
              <FaLinkedin size={18} />
              <span>Sign in with LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("apple")}
            >
              <FaApple size={18} />
              <span>Sign in with Apple</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => signIn("microsoft")}
            >
              <FaMicrosoft size={18} />
              <span>Sign in with Microsoft</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
