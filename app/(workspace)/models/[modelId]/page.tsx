import { notFound } from "next/navigation";
import { models } from "@/components/workspace/fixtures";
import { ModelDetail } from "@/components/workspace/Models";

type Props = { params: Promise<{ modelId: string }> };
export const generateStaticParams = () => models.map(model => ({ modelId: model.id }));

async function findModel(params: Props["params"]) {
  const { modelId } = await params;
  const model = models.find(item => item.id === modelId);
  if (!model) notFound();
  return model;
}

export async function generateMetadata({ params }: Props) {
  const model = await findModel(params);
  return { title: model.name, description: model.description };
}

export default async function Page({ params }: Props) {
  return <ModelDetail model={await findModel(params)} />;
}
