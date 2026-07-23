import { cn } from "@/lib/utils";

interface CornerFrameProps {
  /** Force the brackets visible even without hover (e.g. controlled by parent state) */
  active?: boolean;
  className?: string;
}

/**
 * Four corner brackets that draw in on hover, like a viewfinder locking
 * focus on a subject — a nod to the bounding boxes drawn by Ashverya's
 * detection models. Place inside a `relative` (and usually `group`) parent.
 */
export function CornerFrame({ active, className }: CornerFrameProps) {
  return (
    <div className={cn("absolute inset-2 pointer-events-none", className)}>
      <span className={cn("bracket-corner tl", active && "is-visible")} />
      <span className={cn("bracket-corner tr", active && "is-visible")} />
      <span className={cn("bracket-corner bl", active && "is-visible")} />
      <span className={cn("bracket-corner br", active && "is-visible")} />
    </div>
  );
}
