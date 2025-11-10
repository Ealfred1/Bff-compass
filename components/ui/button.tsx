import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-[#0D9488] focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        default: 'bg-[#0D9488] text-white hover:bg-[#0F766E] hover:-translate-y-[1px] shadow-sm hover:shadow-md',
        destructive:
          'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm hover:shadow-md',
        outline:
          'border-[1.5px] border-[#0D9488]/40 bg-[rgba(13,148,136,0.08)] text-[#0D9488] hover:bg-[rgba(13,148,136,0.15)] shadow-sm',
        secondary:
          'bg-[#F97316] text-white hover:bg-[#EA580C] shadow-sm hover:shadow-md',
        ghost:
          'hover:bg-[#F3F4F6] text-[#374151] bg-transparent',
        link: 'text-[#F97316] underline-offset-4 hover:underline hover:text-[#EA580C] bg-transparent p-0',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 px-4 py-2 text-sm',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
