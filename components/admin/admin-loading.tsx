"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminLoadingProps {
  message?: string;
  variant?: "card" | "inline" | "skeleton";
  className?: string;
}

export function AdminLoading({
  message = "Carregando...",
  variant = "card",
  className,
}: AdminLoadingProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn("flex items-center justify-center gap-3 py-8", className)}
      >
        <Loader2 className="h-5 w-5 animate-spin text-sky-500 dark:text-sky-400" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {message}
        </span>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className={cn("border-gray-200 dark:border-gray-700", className)}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500 dark:text-sky-400" />
            <div className="absolute inset-0 h-8 w-8 animate-ping opacity-20">
              <Loader2 className="h-8 w-8 text-sky-500 dark:text-sky-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aguarde um momento...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AdminLoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function AdminLoadingSkeleton({
  count = 3,
  className,
}: AdminLoadingSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="animate-pulse border-gray-200 dark:border-gray-700"
        >
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
