# Aether: simpler design direction

Updated 3 November 2026. These are project decisions, not universal bans on fonts, colours or component libraries.

## References

- [Z.ai](https://chat.z.ai/): put the useful interface close to the visitor; keep navigation quiet.
- [Abliteration](https://abliteration.ai/): strong type, restrained surfaces and concrete product examples.
- [Abracadabra](https://tryabracadabra.com/): warm editorial type and a conversation that explains the product.

Recent reading: [Sailop's design guide](https://sailop.com/blog/ai-slop-definitive-guide-2026), updated **17 October 2026**, within the requested 3 September–3 November window. [Designpixil's authored guide](https://designpixil.com/blog/ai-slop-design) reports a September 2026 update, without an exact day; treat it as supporting reading rather than proof of the strict date cutoff. Both are practitioner opinions, not usability standards.

## Rules for subsequent edits

1. Explain a specific task in the headline and supporting sentence. Avoid inflated category descriptions.
2. Use each concept's existing type and palette deliberately. One accent is usually sufficient.
3. Prefer an actual interface example to an abstract object, glowing backdrop or decoration.
4. Keep only sections that add distinct information. No placeholder testimonials or repeated feature grids.
5. Let borders, typography and spacing establish hierarchy before adding shadows or glass effects.
6. Keep the headline, CTA and complete example readable without waiting for an entrance animation.
7. Use motion for a user action, such as a model change; avoid forced scroll sequences.
8. Give mobile visitors the same meaningful controls. Let content flow rather than clipping it to a viewport.
9. Keep descriptions, gallery previews and links consistent with the current implementation.
10. Label simulated responses, model specifications and sample pricing. A demo form must state whether it sends anything.

## Implementation

- Shared styling: `components/system/simple.css`.
- Small product examples and model index: `components/system/simple.tsx`.
- Per-concept compositions: `components/designs/d01` through `d12`.
- Existing v1 source backups remain in their original folders. The unmodified repository archive and a before-simplification source snapshot are retained outside this checkout.
- Continue to respect reduced motion, visible keyboard focus, real button semantics and readable contrast.

The reference sites are inspiration; their branding, copy and customer claims are not part of Aether.
