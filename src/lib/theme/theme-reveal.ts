const REVEAL_DURATION_MS = 560;
const REVEAL_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type ViewTransition = { ready: Promise<void> };
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

export type RevealOrigin = { x: number; y: number };

export function originFromElement(element: Element): RevealOrigin {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function farthestCornerRadius({ x, y }: RevealOrigin): number {
  const horizontal = Math.max(x, window.innerWidth - x);
  const vertical = Math.max(y, window.innerHeight - y);
  return Math.hypot(horizontal, vertical);
}

function animateReveal(origin: RevealOrigin): void {
  const radius = farthestCornerRadius(origin);
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${origin.x}px ${origin.y}px)`,
        `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
      ],
    },
    {
      duration: REVEAL_DURATION_MS,
      easing: REVEAL_EASING,
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

export type StartThemeRevealParams = {
  origin: RevealOrigin;
  applyTheme: () => void;
};

export function startThemeReveal({
  origin,
  applyTheme,
}: StartThemeRevealParams): void {
  const viewTransitionDocument = document as ViewTransitionDocument;
  const startViewTransition = viewTransitionDocument.startViewTransition?.bind(
    viewTransitionDocument
  );
  const prefersReducedMotion =
    window.matchMedia(REDUCED_MOTION_QUERY).matches === true;
  if (!startViewTransition || prefersReducedMotion) {
    applyTheme();
    return;
  }
  startViewTransition(applyTheme)
    .ready.then(() => animateReveal(origin))
    .catch(() => undefined);
}
