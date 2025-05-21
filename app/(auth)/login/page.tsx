"use client";

//import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { FaFacebook, FaGithub } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  // Show loading state while checking session
  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const getEmailValidationState = () => {
    if (!touched.email || !formData.email)
      return { isValid: true, message: "" };

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailRegex.test(formData.email);

    return {
      isValid,
      message: isValid ? "" : "Please enter a valid email address",
    };
  };

  const validateForm = () => {
    // Mark all fields as touched to show all validation errors
    setTouched({
      email: true,
      password: true,
    });

    const emailState = getEmailValidationState();

    // Email is required
    if (!formData.email) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    // If email is provided, it should be valid
    if (formData.email && !emailState.isValid) {
      toast({
        title: "Invalid Email",
        description: emailState.message,
        variant: "destructive",
      });
      return false;
    }

    // Password should not be empty
    if (!formData.password) {
      toast({
        title: "Missing Password",
        description: "Please enter your password",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { email, password } = formData;

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return;
      }

      // Success message
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Redirect to dashboard if login was successful
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Server Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Get validation states
  const emailState = getEmailValidationState();

  return (
    <div className="flex justify-center my-12 bg-slate-50 dark:bg-slate-950">
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
            <div className="space-y-1">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`bg-white dark:bg-slate-900 ${
                  touched.email && !emailState.isValid ? "border-red-500" : ""
                }`}
              />
              {touched.email && !emailState.isValid && (
                <p className="text-xs text-red-500">{emailState.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-white dark:bg-slate-900 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
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
              type="button"
              className="w-full flex items-center gap-2"
              onClick={() =>
                signIn("github", {
                  callbackUrl: "/dashboard",
                })
              } // Redirect to dashboard after GitHub login
            >
              <FaGithub size={18} />
              <span>Sign in with GitHub</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center gap-2"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/dashboard",
                })
              }
            >
              <FcGoogle size={18} />
              <span>Sign in with Google</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center gap-2"
              onClick={() =>
                signIn("facebook", {
                  callbackUrl: "/dashboard",
                })
              }
            >
              <FaFacebook size={18} />
              <span>Sign in with Facebook</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Don&#39;t have an account?{" "}
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
