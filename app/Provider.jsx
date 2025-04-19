"use client";

import { verifyAuthNotNav } from "@/api/firebase/functions/auth";

import { MantineProvider } from "@mantine/core";
import { HeroUIProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import { PhotoProvider } from "react-photo-view";
import { ToastContainer } from "react-toastify";

import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-photo-view/dist/react-photo-view.css";
import "./globals.css";
import { useEffect } from "react";
import { FirebaseProvider } from "@/context/FirebaseContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  useEffect(() => {
    verifyAuthNotNav();
  }, []);

  return (
    <HeroUIProvider>
      <MantineProvider>
        <PhotoProvider>
          <FirebaseProvider>{children}</FirebaseProvider>
          <Toaster />
          <NextTopLoader color="#1383e1" />
        </PhotoProvider>
        <ToastContainer />
      </MantineProvider>
    </HeroUIProvider>
  );
}
