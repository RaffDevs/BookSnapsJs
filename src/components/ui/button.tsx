import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-92",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-92",
        ghost: "bg-transparent text-foreground hover:bg-foreground/5",
        outline: "border border-border bg-card text-foreground hover:bg-muted/70",
      },
      size: {
        md: "h-12 px-5 text-sm font-semibold",
        sm: "h-10 px-4 text-sm font-medium",
        lg: "h-14 px-6 text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: ReactNode;
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  children,
  asChild,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
