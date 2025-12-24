"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Loading({ size = "md", className, text }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2
        className={cn(
          "animate-spin text-gray-600 dark:text-gray-400",
          sizeClasses[size]
        )}
      />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
}

export function LoadingSpinner({
  size = "md",
  className,
}: Omit<LoadingProps, "text">) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2
        className={cn(
          "animate-spin text-gray-600 dark:text-gray-400",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
        <Loading size="lg" text={text || "Carregando..."} />
      </div>
    </div>
  );
}
