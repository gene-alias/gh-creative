# Colour Wipe Accordion

Reusable React component built on the project's Base UI accordion. Used by the homepage services section. Importing the component loads its CSS automatically.

```tsx
import {
  ColourWipeAccordion,
  ColourWipeAccordionItem,
  ColourWipeAccordionTrigger,
  ColourWipeAccordionContent,
} from '@/components/ui/colour-wipe-accordion';

<ColourWipeAccordion multiple={false}>
  <ColourWipeAccordionItem value="design">
    <ColourWipeAccordionTrigger>
      <span className="service-number">01 /</span>
      <span>Web design</span>
    </ColourWipeAccordionTrigger>
    <ColourWipeAccordionContent>
      Websites designed around your brand.
    </ColourWipeAccordionContent>
  </ColourWipeAccordionItem>
</ColourWipeAccordion>
```

Use two direct spans in each trigger: number, then label. Chevrons are supplied automatically. The root also accepts `value`, `onValueChange`, and `defaultValue` from the base accordion.

At desktop widths (1024px and above):

- A red divider anchors the fill, which wipes upward over 320ms.
- Top corners have a 12px radius; bottom corners meet the line squarely.
- Hover, keyboard focus, and expanded states widen the fill and line by 1.5%.
- Default type is the base size minus 2px; active type is the base plus 10px. This preserves the final approved sizes: a 12px difference.
- Chevrons stay at the far right in every state.
- Reduced-motion preferences disable transitions.

Below 1024px, the underlying accordion and existing mobile styles apply.

Override CSS custom properties on the root: `--wipe-size`, `--wipe-colour`, `--wipe-ink`, and `--wipe-radius`. Defaults use GH Creative tokens, with colour fallbacks. Typography, content formatting, and page spacing belong to the surrounding design.

To reuse in another project, copy the TSX and CSS along with `accordion.tsx` and its `cn` utility; install React, `@base-ui/react`, and `lucide-react`, and retain the project's Tailwind setup for the base accordion classes.
