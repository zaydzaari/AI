from pathlib import Path

root = Path(__file__).resolve().parents[1]
visuals = {
 '01': '<HeroTranscript />',
 '02': '{variant === "c" ? <ModelIndex /> : <APIExample />}',
 '03': '<ChatWindow />',
 '04': '{variant === "b" ? <Product /> : <ModelIndex />}',
 '05': '<WritingSample />',
 '06': '<GuidedExample render={i => <Device><ChatScreen i={i} /></Device>} />',
 '07': '{variant === "b" ? <Ablation /> : variant === "c" ? <ModelIndex /> : <figure><NeuralGraph /><figcaption className="sys-small">Signal propagation · illustrative schematic</figcaption></figure>}',
 '08': '<Log />',
 '09': '<Index />',
 '10': '{variant === "b" ? <Builder /> : <Console />}',
 '11': '{variant === "b" ? <HeroSlab /> : <Wipe />}',
 '12': '{variant === "b" ? <ModelIndex /> : <div className="simple-specimen sys-invert"><Specimen compact /></div>}',
}
anchors = {'03':'anchor="product"','04':'anchor={variant === "b" ? "product" : undefined}','07':'anchor={variant === "b" ? "experiment" : undefined}','08':'anchor="log"','10':'anchor={variant === "b" ? "api" : undefined}','11':'anchor={variant !== "b" ? "compare" : undefined}','12':'anchor="product"'}
for id, visual in visuals.items():
 p = root / f'components/designs/d{id}/Design{id}.tsx'
 s = p.read_text(encoding='utf-8')
 if 'CompositionHero' in s: continue
 s = s.replace('"use client";', '"use client";\n\nimport { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";\nimport { useStudio } from "@/components/lab/StudioProvider";', 1)
 signature=f'export default function Design{id}() {{'
 s=s.replace(signature, signature+'\n  const { settings: { variant } } = useStudio();')
 start=s.index('        <section',s.index('<main'))
 end=s.index('</section>',start)+len('</section>')
 s=s[:start]+f'        <CompositionHero id="{id}" {anchors.get(id, "")}>\n          {visual}\n        </CompositionHero>'+s[end:]
 # Promote examples while retaining every navigation destination and avoiding duplicate IDs.
 if id in ['04','07','11']:
  section_id={'04':'product','07':'experiment','11':'compare'}[id]
  start=s.index(f'        <section id="{section_id}"')
  end=s.index('</section>',start)+len('</section>')
  condition='variant !== "b"' if id in ['04','07'] else 'variant === "b"'
  s=s[:start]+f'        {{{condition} && (\n'+s[start:end]+'\n        )}'+s[end:]
 if id=='08':
  start=s.index('        <section id="log"')
  end=s.index('</section>',start)+len('</section>')
  s=s[:start]+s[end:]
 if id=='10':
  start=s.index('        <section id="api"')
  end=s.index('</section>',start)+len('</section>')
  original=s[start:end]
  alt=original.replace('id="api"','id="product"').replace('Build the request. Copy it. Ship.','Keep the conversation.').replace('Pick a model, a variant and options; the request writes itself.','Choose a prompt and compare models. Responses are simulated.').replace('<Builder />','<Console />')
  s=s[:start]+'        {variant === "b" ? (\n'+alt+'\n        ) : (\n'+original+'\n        )}'+s[end:]
 p.write_text(s,encoding='utf-8')
print('Connected all 12 concepts to their three compositions.')
