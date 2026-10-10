"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#fafcfa",
          color: "#1d271f",
          border: "1px solid #e1e8e1",
          borderRadius: "12px",
          fontFamily: "inherit",
        },
        success: { iconTheme: { primary: "#05893e", secondary: "#f3fbf4" } },
        error: { iconTheme: { primary: "#d03739", secondary: "#fff6f5" } },
      }}
    />
  );
}
