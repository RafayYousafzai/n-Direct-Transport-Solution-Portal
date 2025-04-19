"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProvider } from "@/context/AdminProvider";

export default function RootLayout({ children }) {
  const nav = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = async () => {
      try {
        const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
        const role = userDoc.role || null;

        if (!role || role === "archived") {
          nav.push("/Signin");
        } else if (role === "user" || role === "business") {
          nav.push("/ClientServices");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        nav.push("/Signin");
      }
    };

    auth();
  }, [nav]);

  if (loading) return;

  return <AdminProvider>{children}</AdminProvider>;
}
