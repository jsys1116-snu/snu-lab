import { notFound } from "next/navigation";
import LocalPublicationsEditor from "@/components/LocalPublicationsEditor";
import { isLocalPageRequest } from "@/lib/localOnly";

export default async function LocalPublicationsPage() {
  const isLocal = await isLocalPageRequest();

  if (!isLocal) {
    notFound();
  }

  return <LocalPublicationsEditor />;
}
