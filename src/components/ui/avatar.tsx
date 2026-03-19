import { type HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, size = "md", className, ...props }, ref) => {
    const initials = getInitials(name);

    if (src) {
      const px = size === "sm" ? 32 : size === "md" ? 40 : 56;
      return (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className={cn(
            "rounded-full object-cover",
            sizeStyles[size],
            className,
          )}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full bg-gradient-to-br from-surface to-border flex items-center justify-center font-bold text-forest",
          sizeStyles[size],
          className,
        )}
        aria-label={name}
        {...props}
      >
        {initials}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar, type AvatarProps };
