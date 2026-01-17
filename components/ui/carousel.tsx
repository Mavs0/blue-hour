"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

export function Carousel({
  children,
  className,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [itemsPerView, setItemsPerView] = React.useState(3);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  // Update items per view on resize
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(totalItems / itemsPerView);

  const scrollToSlide = React.useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth / itemsPerView;
      const scrollPosition = index * cardWidth * itemsPerView;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, [itemsPerView]);

  const nextSlide = React.useCallback(() => {
    const next = (currentIndex + 1) % totalSlides;
    scrollToSlide(next);
  }, [currentIndex, totalSlides, scrollToSlide]);

  const prevSlide = React.useCallback(() => {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    scrollToSlide(prev);
  }, [currentIndex, totalSlides, scrollToSlide]);

  // Auto-play
  React.useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % totalSlides;
        setTimeout(() => scrollToSlide(next), 0);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, totalSlides, scrollToSlide]);

  // Handle scroll to update current index
  const handleScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth / itemsPerView;
      const newIndex = Math.round(scrollLeft / (cardWidth * itemsPerView));
      setCurrentIndex(newIndex);
    }
  }, [itemsPerView]);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  if (totalItems === 0) return null;

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start"
            style={{
              width: `calc(100% / ${itemsPerView})`,
              minWidth: `calc(100% / ${itemsPerView})`,
            }}
          >
            <div className="px-3">{child}</div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:flex"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:flex"
            disabled={currentIndex === totalSlides - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "w-8 bg-purple-600 dark:bg-purple-500"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
