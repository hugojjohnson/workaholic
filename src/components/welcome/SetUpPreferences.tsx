"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export default function FadeComponent() {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  const [transitionNum, transitionTailwind] = [500, "duration-500"]


  const hoursPage = <div>
    <p>How many hours do you want?</p>
  </div>

  const nextPage = <div>
    <p>This is the next page.</p>
  </div>

  const lastPage = <div>
    <p>This is the last page.</p>
  </div>

  const pages = [hoursPage, nextPage, lastPage];
  const animatePageTransition = async (currentIndex: number, offset: 1 | -1): Promise<void> => {
    setVisible(false);
    await sleep(transitionNum + 500);
    setPageIndex((currentIndex + 1)%pages.length);
    setVisible(true);
  };
  const canGoBack = pageIndex > 0;
  const canGoForward = pageIndex < pages.length-1;

  return (
    <div className="flex flex-col justify-center items-center mt-32">
      <div
        className={`transition-opacity ${transitionTailwind} ${visible ? "opacity-100" : "opacity-0"
          }`}
      >
        {
          pages[pageIndex]
        }
      </div>

       <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={() => canGoBack && animatePageTransition(pageIndex, -1)}
        disabled={!canGoBack}
        className={`transition-colors ${
          canGoBack
            ? "text-black hover:bg-muted"
            : "text-muted-foreground cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {pageIndex + 1} / {pages.length}
      </span>

      <Button
        variant="outline"
        onClick={() => canGoForward && animatePageTransition(pageIndex, 1)}
        disabled={!canGoForward}
        className={`transition-colors ${
          canGoForward
            ? "text-black hover:bg-muted"
            : "text-muted-foreground cursor-not-allowed"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
    </div>
  );
}
