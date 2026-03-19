"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getDecryptedCookie } from "@/lib/cookie.utils";
import { COOKIES } from "@/constants/cookie.constant";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = getDecryptedCookie(COOKIES.AUTH_USER);

        if (!user) {
          router.replace("/");
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.replace("/");
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background/50 backdrop-blur-md">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Decrypting Session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
