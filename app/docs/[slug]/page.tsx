import { notFound } from "next/navigation";
import { DocPage } from "../DocPage";
import { articles } from "../content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.filter(article => article.slug).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find(entry => entry.slug === slug);
  if (!article) notFound();
  return { title: `${article.title} | Aether Docs`, description: article.summary };
}

export default async function DocsArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find(entry => entry.slug === slug);
  if (!article) notFound();
  return <DocPage article={article} />;
}
