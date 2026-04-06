"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

type PendingTransition = {
  fromRouteKey: string;
  resolve: () => void;
  timeoutId: number;
};

const ROUTE_CHANGE_TIMEOUT_MS = 1200;

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
}

export default function RouteEffects() {
  const pathname = usePathname();
  const pendingPopTransitionRef = useRef<PendingTransition | null>(null);
  const isHistoryNavigationRef = useRef(false);

  useEffect(() => {
    const pending = pendingPopTransitionRef.current;
    if (!pending) {
      return;
    }

    if (pathname !== pending.fromRouteKey) {
      clearTimeout(pending.timeoutId);
      pending.resolve();
      pendingPopTransitionRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    const isHistoryNavigation = isHistoryNavigationRef.current;

    // Auto-scroll to top only for forward/blog navigations.
    // On back/forward history navigations, let the browser preserve position
    // so title-to-link reverse transitions are not disturbed.
    if (pathname.startsWith("/blog") && !isHistoryNavigation) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    isHistoryNavigationRef.current = false;
  }, [pathname]);

  useEffect(() => {
    function clearPendingPopTransition() {
      const pending = pendingPopTransitionRef.current;
      if (!pending) {
        return;
      }

      clearTimeout(pending.timeoutId);
      pending.resolve();
      pendingPopTransitionRef.current = null;
    }

    function beginHistoryTransition(action?: () => void) {
      const transitionDocument = document as TransitionDocument;
      if (typeof transitionDocument.startViewTransition !== "function") {
        action?.();
        return;
      }

      clearPendingPopTransition();

      transitionDocument.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timeoutId = window.setTimeout(() => {
              if (pendingPopTransitionRef.current) {
                pendingPopTransitionRef.current.resolve();
                pendingPopTransitionRef.current = null;
              }
            }, ROUTE_CHANGE_TIMEOUT_MS);

            pendingPopTransitionRef.current = {
              fromRouteKey: pathname,
              resolve,
              timeoutId,
            };

            action?.();
          })
      );
    }

    function handlePopState() {
      if (pendingPopTransitionRef.current) {
        return;
      }

      isHistoryNavigationRef.current = true;
      beginHistoryTransition();
    }

    function handleKeyDown(event: KeyboardEvent) {
      const isAltLeftArrow =
        event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.key === "ArrowLeft";

      if (!isAltLeftArrow || isEditableElement(event.target) || pendingPopTransitionRef.current) {
        return;
      }

      if (window.history.length <= 1) {
        return;
      }

      event.preventDefault();
      isHistoryNavigationRef.current = true;
      beginHistoryTransition(() => {
        window.history.back();
      });
    }

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      clearPendingPopTransition();
    };
  }, [pathname]);

  return null;
}
