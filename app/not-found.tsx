import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export default async function NotFound() {
  const lang = await getLang();
  const copy = t(lang);
  return (
    <Card className="mx-auto max-w-xl text-center">
      <h1 className="text-2xl font-bold text-white">{copy.pageNotFoundTitle}</h1>
      <p className="mt-2 text-slate-300">{copy.pageNotFoundDesc}</p>
      <Link href="/" className="mt-4 inline-block">
        <Button>{copy.backHome}</Button>
      </Link>
    </Card>
  );
}
