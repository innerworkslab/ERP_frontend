"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { authService, LoginResponse } from "@/api/auth.service";
import { setEncryptedCookie } from "@/lib/cookie.utils";
import { COOKIES } from "@/constants/cookie.constant";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const { request, loading, error } = useApi<LoginResponse>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await request(() =>
      authService.login({ phone_number: phoneNumber, password }),
    );
    if (res) {
      setEncryptedCookie(
        COOKIES.AUTH_USER,
        {
          user: res.user,
          token: res.token,
        },
        7,
      );
      router.push("/auth");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-6 bg-card/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-background/50 border-none h-11 focus-visible:ring-primary/50"
          />

          <div className="relative">
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-none h-11 focus-visible:ring-primary/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center font-medium bg-destructive/10 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
