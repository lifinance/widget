import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils.js'

const variants = {
  variant: {
    default: 'lifi-button-variant-default',
    outline: 'lifi-button-variant-outline',
    secondary: 'lifi-button-variant-secondary',
    ghost: 'lifi-button-variant-ghost',
    destructive: 'lifi-button-variant-destructive',
    link: 'lifi-button-variant-link',
  },
  size: {
    default: 'lifi-button-size-default',
    xs: 'lifi-button-size-xs',
    sm: 'lifi-button-size-sm',
    lg: 'lifi-button-size-lg',
    icon: 'lifi-button-size-icon',
    'icon-xs': 'lifi-button-size-icon-xs',
    'icon-sm': 'lifi-button-size-icon-sm',
    'icon-lg': 'lifi-button-size-icon-lg',
  },
}

const buttonVariants: (
  props?: {
    [Variant in keyof typeof variants]?:
      | keyof (typeof variants)[Variant]
      | null
      | undefined
  }
) => string = cva(
  'lifi-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants,
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type ButtonProps = Omit<ButtonPrimitive.Props, 'className'> & {
  className?: string
} & VariantProps<typeof buttonVariants>

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { buttonVariants }
