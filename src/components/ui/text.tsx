import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

const textVariants = cva(
  cn('text-foreground text-body', Platform.select({ web: 'select-text' })),
  {
    variants: {
      variant: {
        default: '',
        display: 'text-center text-display font-extrabold tracking-tight',
        headline: 'text-headline font-semibold tracking-tight',
        title: 'text-title font-semibold',
        body: 'text-body font-normal',
        label: 'text-label font-medium',
        h1: 'text-center text-display font-extrabold tracking-tight',
        h2: 'text-headline border-border border-b pb-2 font-semibold tracking-tight',
        h3: 'text-title font-semibold',
        h4: 'text-[1.25rem] leading-[1.3] font-semibold',
        p: 'text-body mt-3 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: 'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        lead: 'text-xl leading-relaxed',
        large: 'text-lg font-semibold',
        small: 'text-label font-medium',
        muted: 'text-label text-muted-foreground font-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type TextVariantProps = VariantProps<typeof textVariants>;
type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  display: 'heading',
  headline: 'heading',
  title: 'heading',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  display: '1',
  headline: '2',
  title: '3',
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  const resolvedVariant = variant ?? 'default';

  return (
    <Component
      className={cn(textVariants({ variant: resolvedVariant }), textClass, className)}
      role={ROLE[resolvedVariant]}
      aria-level={ARIA_LEVEL[resolvedVariant]}
      {...props}
    />
  );
}

export { Text, TextClassContext };
