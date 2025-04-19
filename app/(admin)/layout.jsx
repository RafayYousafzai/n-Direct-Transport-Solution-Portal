"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stats } from "@/components/Index";
import { ScrollArea } from "@mantine/core";
import { ScrollShadow } from "@heroui/react";
import { AdminProvider } from "@/context/AdminProvider";
import Script from "next/script";

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

  return (
    <AdminProvider>
      <ScrollShadow>
        <ScrollArea>
          <Stats />
          {children}
        </ScrollArea>
      </ScrollShadow>
    </AdminProvider>
  );
}
