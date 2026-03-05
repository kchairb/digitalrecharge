import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-slate-300">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-4 inline-block">
        <Button>Back Home</Button>
      </Link>
    </Card>
  );
}
