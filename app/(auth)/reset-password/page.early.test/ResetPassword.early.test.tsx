import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPassword from "../[token]/page";

// app/(auth)/reset-password/page.test.tsx
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

// app/(auth)/reset-password/page.test.tsx
// Mocks for next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock for useToast
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock for next/link (as a passthrough)
jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock for lucide-react icons
jest.mock("lucide-react", () => ({
  Eye: (props: any) => <svg data-testid="eye-icon" {...props} />,
  EyeOff: (props: any) => <svg data-testid="eyeoff-icon" {...props} />,
  ArrowLeft: (props: any) => <svg data-testid="arrowleft-icon" {...props} />,
  CheckCircle: (props: any) => (
    <svg data-testid="checkcircle-icon" {...props} />
  ),
}));

// Mock for UI components
jest.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props} />,
}));
jest.mock("@/components/ui/card", () => ({
  Card: (props: any) => <div {...props} />,
  CardContent: (props: any) => <div {...props} />,
  CardDescription: (props: any) => <div {...props} />,
  CardFooter: (props: any) => <div {...props} />,
  CardHeader: (props: any) => <div {...props} />,
  CardTitle: (props: any) => <div {...props} />,
}));
jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

describe("ResetPassword() ResetPassword method", () => {
  // Setup mocks
  const pushMock = jest.fn();
  const toastMock = jest.fn();
  let searchParamsGetMock: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup useRouter mock
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Setup useToast mock
    (useToast as jest.Mock).mockReturnValue({ toast: toastMock });

    // Setup useSearchParams mock
    searchParamsGetMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: searchParamsGetMock,
    });
  });

  // -------------------- HAPPY PATHS --------------------
  describe("Happy Paths", () => {
    test("renders the reset password form when token is present", () => {
      // This test ensures the form renders when a valid token is present in the URL.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm New Password")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /update password/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Back to Login")).toBeInTheDocument();
    });

    test("toggles password visibility when eye icon is clicked", () => {
      // This test ensures clicking the eye icon toggles password visibility.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const toggleBtn = screen.getAllByRole("button")[0]; // First button is for password visibility

      // Initially type is password
      expect(passwordInput).toHaveAttribute("type", "password");
      fireEvent.click(toggleBtn);
      // After click, type should be text
      expect(passwordInput).toHaveAttribute("type", "text");
      fireEvent.click(toggleBtn);
      // After another click, type should be password again
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("toggles confirm password visibility when eye icon is clicked", () => {
      // This test ensures clicking the eye icon toggles confirm password visibility.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const toggleBtns = screen.getAllByRole("button");
      const confirmToggleBtn = toggleBtns[1]; // Second button is for confirm password

      expect(confirmInput).toHaveAttribute("type", "password");
      fireEvent.click(confirmToggleBtn);
      expect(confirmInput).toHaveAttribute("type", "text");
      fireEvent.click(confirmToggleBtn);
      expect(confirmInput).toHaveAttribute("type", "password");
    });

    test("shows password requirements and highlights as user types", () => {
      // This test ensures password requirements are shown and highlighted as user types.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");

      // Type a password with only lowercase
      fireEvent.change(passwordInput, { target: { value: "abcdefg" } });
      expect(screen.getByText("At least 8 characters")).not.toHaveClass(
        "text-green-600"
      );
      expect(screen.getByText("One uppercase letter")).not.toHaveClass(
        "text-green-600"
      );
      expect(screen.getByText("One lowercase letter")).toBeInTheDocument();
      expect(screen.getByText("One number")).not.toHaveClass("text-green-600");
      expect(screen.getByText("One special character")).not.toHaveClass(
        "text-green-600"
      );

      // Type a valid password
      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      expect(screen.getByText("At least 8 characters").className).toMatch(
        /text-green-600/
      );
      expect(screen.getByText("One uppercase letter").className).toMatch(
        /text-green-600/
      );
      expect(screen.getByText("One lowercase letter").className).toMatch(
        /text-green-600/
      );
      expect(screen.getByText("One number").className).toMatch(
        /text-green-600/
      );
      expect(screen.getByText("One special character").className).toMatch(
        /text-green-600/
      );
    });

    test("submits form with valid data and shows success message", async () => {
      // This test ensures submitting valid data calls the API and shows the success message.
      searchParamsGetMock.mockReturnValue("valid-token");
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }) as any;

      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // Success toast should be called
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password Reset Successful",
        })
      );

      // Success message should be shown
      expect(screen.getByText("Password Reset Successful")).toBeInTheDocument();
      expect(
        screen.getByText(/Your password has been updated successfully/)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /continue to login/i })
      ).toBeInTheDocument();
    });

    test('clicking "Continue to Login" after success navigates to login', async () => {
      // This test ensures clicking "Continue to Login" after success navigates to /login.
      searchParamsGetMock.mockReturnValue("valid-token");
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }) as any;

      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      const continueBtn = screen.getByRole("button", {
        name: /continue to login/i,
      });
      fireEvent.click(continueBtn);

      expect(pushMock).toHaveBeenCalledWith("/login");
    });

    test('clicking "Back to Login" link navigates to login', () => {
      // This test ensures clicking the "Back to Login" link navigates to /login.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const backToLoginLink = screen.getByText("Back to Login");
      fireEvent.click(backToLoginLink);
      // Since it's a link, we check the href
      expect(backToLoginLink).toHaveAttribute("href", "/login");
    });
  });

  // -------------------- EDGE CASES --------------------
  describe("Edge Cases", () => {
    test("redirects and shows toast if token is missing", async () => {
      // This test ensures that if the token is missing, the user is redirected and a toast is shown.
      searchParamsGetMock.mockReturnValue(null);

      render(<ResetPassword />);
      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Invalid Reset Link",
            description: "The reset link is invalid or has expired",
            variant: "destructive",
          })
        );
        expect(pushMock).toHaveBeenCalledWith("/forgot-password");
      });
    });

    test("shows error if password is missing on submit", async () => {
      // This test ensures that submitting with missing password shows an error toast.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Missing Password",
          description: "Please enter a new password",
          variant: "destructive",
        })
      );
    });

    test("shows error if password does not meet requirements", async () => {
      // This test ensures that submitting with an invalid password shows an error toast.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "abc" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "abc" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Invalid Password",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        })
      );
    });

    test("shows error if confirm password is missing", async () => {
      // This test ensures that submitting with missing confirm password shows an error toast.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Missing Confirmation",
          description: "Please confirm your password",
          variant: "destructive",
        })
      );
    });

    test("shows error if passwords do not match", async () => {
      // This test ensures that submitting with mismatched passwords shows an error toast.
      searchParamsGetMock.mockReturnValue("valid-token");
      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "Abcdefg1@" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        })
      );
    });

    test("shows API error if reset fails", async () => {
      // This test ensures that if the API returns an error, the error toast is shown.
      searchParamsGetMock.mockReturnValue("valid-token");
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Token expired" }),
      }) as any;

      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Reset Failed",
          description: "Token expired",
          variant: "destructive",
        })
      );
    });

    test("shows generic API error if reset fails without message", async () => {
      // This test ensures that if the API returns an error without a message, a generic error is shown.
      searchParamsGetMock.mockReturnValue("valid-token");
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }) as any;

      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Reset Failed",
          description: "Something went wrong",
          variant: "destructive",
        })
      );
    });

    test("disables submit button and shows loading text while submitting", async () => {
      // This test ensures the submit button is disabled and shows loading text while submitting.
      searchParamsGetMock.mockReturnValue("valid-token");
      let resolveFetch: any;
      global.fetch = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          })
      ) as any;

      render(<ResetPassword />);
      const passwordInput = screen.getByPlaceholderText("New Password");
      const confirmInput = screen.getByPlaceholderText("Confirm New Password");
      const submitBtn = screen.getByRole("button", {
        name: /update password/i,
      });

      fireEvent.change(passwordInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(passwordInput);
      fireEvent.change(confirmInput, { target: { value: "Abcdefg1!" } });
      fireEvent.blur(confirmInput);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(submitBtn).toBeDisabled();
      expect(submitBtn).toHaveTextContent("Updating...");

      // Resolve fetch to finish submission
      await act(async () => {
        resolveFetch({ ok: true, json: async () => ({}) });
      });
    });
  });
});
