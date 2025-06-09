"use client";

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
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState({
    email: "",
  });
  const [touched, setTouched] = useState({
    email: false,
  });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  // Show loading state while checking session
  if (sessionStatus === "loading") {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-slate-50 dark:bg-slate-950 z-50">
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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { email } = formData;

    try {
      setLoading(true);

      // Replace this with your actual API endpoint
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      // Success
      setEmailSent(true);
      toast({
        title: "Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get validation states
  const emailState = getEmailValidationState();

  if (emailSent) {
    return (
      <div className="flex justify-center my-12 bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription>
              We've sent password reset instructions to{" "}
              <span className="font-medium">{formData.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setFormData({ email: "" });
                  setTouched({ email: false });
                }}
                className="text-primary hover:underline font-medium"
              >
                try again
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex justify-center my-12 bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your
              password
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

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  );
}
