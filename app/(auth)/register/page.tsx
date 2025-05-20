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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
//import { Github, Google, Search } from "lucide-react";
//import { FcGoogle } from "react-icons/fc";
//import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const getUsernameValidationState = () => {
    if (!touched.username || !formData.username)
      return { isValid: true, message: "" };

    const minLength = 3;
    const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(formData.username);

    if (!hasValidChars) {
      return {
        isValid: false,
        message:
          "Username can only contain letters, numbers, underscores and hyphens",
      };
    }

    if (formData.username.length < minLength) {
      return {
        isValid: false,
        message: `Username must be at least ${minLength} characters`,
      };
    }

    return { isValid: true, message: "" };
  };

  const validateForm = () => {
    // Mark all fields as touched to show all validation errors
    setTouched({
      username: true,
      email: true,
      password: true,
    });

    const emailState = getEmailValidationState();
    const usernameState = getUsernameValidationState();
    const passwordValid = passwordStrength.score >= 60; // Require at least "Fair" password

    if (!emailState.isValid) {
      toast({
        title: "Invalid Email",
        description: emailState.message,
        variant: "destructive",
      });
      return false;
    }

    if (!usernameState.isValid) {
      toast({
        title: "Invalid Username",
        description: usernameState.message,
        variant: "destructive",
      });
      return false;
    }

    if (!passwordValid) {
      toast({
        title: "Weak Password",
        description:
          "Your password doesn't meet the minimum strength requirements",
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

    const { username, email, password } = formData;

    try {
      setLoading(true);

      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Registration Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      // Clear form
      setFormData({ username: "", email: "", password: "" });
      setTouched({ username: false, email: false, password: false });

      // Success message
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
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
  const usernameState = getUsernameValidationState();

  // Get progress color based on password strength
  const getProgressColor = () => {
    if (passwordStrength.score <= 20) return "bg-red-500";
    if (passwordStrength.score <= 40) return "bg-orange-500";
    if (passwordStrength.score <= 60) return "bg-yellow-500";
    if (passwordStrength.score <= 80) return "bg-green-400";
    return "bg-green-500";
  };

  return (
    <div className="flex justify-center my-8 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Register
          </CardTitle>
          <CardDescription className="text-center">
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`bg-white dark:bg-slate-900 ${
                  touched.username && !usernameState.isValid
                    ? "border-red-500"
                    : ""
                }`}
              />
              {touched.username && !usernameState.isValid && (
                <p className="text-xs text-red-500">{usernameState.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`bg-white dark:bg-slate-900 ${
                  touched.email && !emailState.isValid ? "border-red-500" : ""
                }`}
              />
              {touched.email && !emailState.isValid && (
                <p className="text-xs text-red-500">{emailState.message}</p>
              )}
            </div>

            <div className="space-y-2">
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 px-2 text-xs text-slate-500">
              OR
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
