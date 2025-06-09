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
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL parameters
  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      toast({
        title: "Invalid Reset Link",
        description: "The reset link is invalid or has expired",
        variant: "destructive",
      });
      router.push("/forgot-password");
      return;
    }
    setToken(resetToken);
  }, [searchParams, router, toast]);

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

  const getPasswordValidationState = () => {
    if (!touched.password || !formData.password)
      return { isValid: true, message: "" };

    const password = formData.password;
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!hasUpperCase) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!hasLowerCase) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!hasNumbers) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }
    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: "Password must contain at least one special character",
      };
    }

    return { isValid: true, message: "" };
  };

  const getConfirmPasswordValidationState = () => {
    if (!touched.confirmPassword || !formData.confirmPassword)
      return { isValid: true, message: "" };

    const isValid = formData.password === formData.confirmPassword;
    return {
      isValid,
      message: isValid ? "" : "Passwords do not match",
    };
  };

  const validateForm = () => {
    // Mark all fields as touched to show all validation errors
    setTouched({
      password: true,
      confirmPassword: true,
    });

    const passwordState = getPasswordValidationState();
    const confirmPasswordState = getConfirmPasswordValidationState();

    // Password is required
    if (!formData.password) {
      toast({
        title: "Missing Password",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return false;
    }

    // Password should be valid
    if (formData.password && !passwordState.isValid) {
      toast({
        title: "Invalid Password",
        description: passwordState.message,
        variant: "destructive",
      });
      return false;
    }

    // Confirm password is required
    if (!formData.confirmPassword) {
      toast({
        title: "Missing Confirmation",
        description: "Please confirm your password",
        variant: "destructive",
      });
      return false;
    }

    // Passwords should match
    if (formData.confirmPassword && !confirmPasswordState.isValid) {
      toast({
        title: "Password Mismatch",
        description: confirmPasswordState.message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    const { password } = formData;

    try {
      setLoading(true);

      // Replace this with your actual API endpoint
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      // Success
      setResetSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Reset Failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Get validation states
  const passwordState = getPasswordValidationState();
  const confirmPasswordState = getConfirmPasswordValidationState();

  if (resetSuccess) {
    return (
      <div className="flex justify-center my-12 bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Password Reset Successful
            </CardTitle>
            <CardDescription>
              Your password has been updated successfully. You can now sign in
              with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-12 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-white dark:bg-slate-900 pr-10 ${
                    touched.password && !passwordState.isValid
                      ? "border-red-500"
                      : ""
                  }`}
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
              {touched.password && !passwordState.isValid && (
                <p className="text-xs text-red-500">{passwordState.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-white dark:bg-slate-900 pr-10 ${
                    touched.confirmPassword && !confirmPasswordState.isValid
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && !confirmPasswordState.isValid && (
                <p className="text-xs text-red-500">
                  {confirmPasswordState.message}
                </p>
              )}
            </div>

            {/* Password requirements */}
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-medium">Password must contain:</p>
              <ul className="space-y-1 ml-2">
                <li
                  className={`flex items-center gap-1 ${
                    formData.password.length >= 8
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <span className="text-[10px]">•</span>
                  At least 8 characters
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    /[A-Z]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <span className="text-[10px]">•</span>
                  One uppercase letter
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    /[a-z]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <span className="text-[10px]">•</span>
                  One lowercase letter
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    /\d/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <span className="text-[10px]">•</span>
                  One number
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  <span className="text-[10px]">•</span>
                  One special character
                </li>
              </ul>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update Password"}
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
  );
}
