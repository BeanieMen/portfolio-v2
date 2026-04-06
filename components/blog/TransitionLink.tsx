"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

type TransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
};

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

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function TransitionLink({ href, className, children, title, ariaLabel }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routeKey = pathname;
  const pendingTransitionRef = useRef<PendingTransition | null>(null);

  useEffect(() => {
    const pending = pendingTransitionRef.current;
    if (!pending) {
      return;
    }

    const nextRouteKey = pathname;
    if (nextRouteKey !== pending.fromRouteKey) {
      clearTimeout(pending.timeoutId);
      pending.resolve();
      pendingTransitionRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      const pending = pendingTransitionRef.current;
      if (!pending) {
        return;
      }

      clearTimeout(pending.timeoutId);
      pending.resolve();
      pendingTransitionRef.current = null;
    };
  }, []);

  function clearPreviousPendingTransition() {
    const pending = pendingTransitionRef.current;
    if (!pending) {
      return;
    }

    clearTimeout(pending.timeoutId);
    pending.resolve();
    pendingTransitionRef.current = null;
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldUseNativeNavigation(event) || href.startsWith("http") || href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    const transitionDocument = document as TransitionDocument;
    if (typeof transitionDocument.startViewTransition === "function") {
      transitionDocument.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            clearPreviousPendingTransition();

            const timeoutId = window.setTimeout(() => {
              if (pendingTransitionRef.current) {
                pendingTransitionRef.current.resolve();
                pendingTransitionRef.current = null;
              }
            }, ROUTE_CHANGE_TIMEOUT_MS);

            pendingTransitionRef.current = {
              fromRouteKey: routeKey,
              resolve,
              timeoutId,
            };

            router.push(href);
          })
      );
      return;
    }

    router.push(href);
  }

  return (
    <Link href={href} className={className} onClick={handleClick} title={title} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
