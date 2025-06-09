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
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  // Password strength criteria
  const passwordCriteria = [
    { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", label: "Contains uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", label: "Contains lowercase letter", regex: /[a-z]/ },
    { id: "number", label: "Contains number", regex: /[0-9]/ },
    {
      id: "special",
      label: "Contains special character",
      regex: /[^A-Za-z0-9]/,
    },
  ];

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (formData.password) {
      const metCriteria = passwordCriteria.filter((criteria) =>
        criteria.regex.test(formData.password)
      ).length;

      const score = Math.min(
        100,
        (metCriteria / passwordCriteria.length) * 100
      );

      let feedback = "";
      if (score === 0) feedback = "Enter password";
      else if (score <= 20) feedback = "Very weak";
      else if (score <= 40) feedback = "Weak";
      else if (score <= 60) feedback = "Fair";
      else if (score <= 80) feedback = "Good";
      else feedback = "Strong";

      setPasswordStrength({ score, feedback });
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [formData.password]);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/v1/auth/verify-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: params.token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          toast({
            title: "Invalid Reset Link",
            description:
              data.message || "The reset link is invalid or has expired",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setTokenValid(false);
        toast({
          title: "Error",
          description: "Failed to verify reset link",
          variant: "destructive",
        });
      } finally {
        setTokenLoading(false);
      }
    };

    if (params.token) {
      verifyToken();
    }
  }, [params.token, toast]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  // Show loading state while checking session or token
  if (sessionStatus === "loading" || tokenLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-slate-50 dark:bg-slate-950 z-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="flex justify-center my-12 bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request
              a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              Request New Reset Link
            </Button>
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

    const confirmPasswordState = getConfirmPasswordValidationState();
    const passwordValid = passwordStrength.score >= 60; // Require at least "Fair" password

    // Password is required
    if (!formData.password) {
      toast({
        title: "Missing Password",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return false;
    }

    // Password should meet strength requirements
    if (!passwordValid) {
      toast({
        title: "Weak Password",
        description:
          "Your password doesn't meet the minimum strength requirements",
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
    if (!confirmPasswordState.isValid) {
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

    if (!validateForm()) {
      return;
    }

    const { password } = formData;

    try {
      setLoading(true);

      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: params.token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Reset Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
        return;
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Get validation states
  const confirmPasswordState = getConfirmPasswordValidationState();

  // Get progress color based on password strength
  const getProgressColor = () => {
    if (passwordStrength.score <= 20) return "bg-red-500";
    if (passwordStrength.score <= 40) return "bg-orange-500";
    if (passwordStrength.score <= 60) return "bg-yellow-500";
    if (passwordStrength.score <= 80) return "bg-green-400";
    return "bg-green-500";
  };

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
    sessionStatus !== "authenticated" && (
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
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New Password"
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

                {formData.password && (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs pb-1">
                        <span>Password strength</span>
                        <span
                          className={`font-medium ${
                            passwordStrength.score > 60
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength.score}
                        className="h-1.5 w-full bg-gray-200 dark:bg-gray-700"
                      >
                        <div
                          className={`h-full ${getProgressColor()}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </Progress>
                    </div>

                    <div className="pt-2 space-y-1">
                      {passwordCriteria.map((criteria) => (
                        <div
                          key={criteria.id}
                          className="flex items-center text-xs gap-1.5"
                        >
                          {criteria.regex.test(formData.password) ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-gray-400" />
                          )}
                          <span
                            className={
                              criteria.regex.test(formData.password)
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500"
                            }
                          >
                            {criteria.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
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
                    required
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

              <Button
                type="submit"
                disabled={loading || passwordStrength.score < 60}
                className="w-full"
              >
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
    )
  );
}
