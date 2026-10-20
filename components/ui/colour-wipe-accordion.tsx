'use client';

import type { ComponentProps } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { cn } from '@/lib/utils';
import './colour-wipe-accordion.css';

/** Desktop colour-wipe variant; retains the underlying accordion's keyboard controls. */
export function ColourWipeAccordion({ className, ...props }: ComponentProps<typeof Accordion>) {
  return <Accordion className={cn('colour-wipe-accordion', className)} {...props} />;
}

export {
  AccordionItem as ColourWipeAccordionItem,
  AccordionTrigger as ColourWipeAccordionTrigger,
  AccordionContent as ColourWipeAccordionContent,
};
