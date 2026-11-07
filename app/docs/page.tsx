import { DocPage } from "./DocPage";
import { articles } from "./content";

export const metadata = { title: "Quickstart | Aether Docs", description: articles[0].summary };

export default function DocsHome() {
  return <DocPage article={articles[0]} />;
}
