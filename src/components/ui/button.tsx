import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-normal transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gray-950 text-white hover:bg-purple-500",
        outline:
          "border border-gray-950 bg-transparent hover:bg-gray-950 hover:text-white",
        ghost:
          "bg-transparent text-white hover:bg-purple-500",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4 py-2",
        sm: "h-7 px-3 text-xs",
        xs: "h-6 px-2 text-xs",
        lg: "h-10 px-6",
        icon: "h-8 w-8",
        "icon-sm": "h-6 w-6",
        "icon-xs": "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
