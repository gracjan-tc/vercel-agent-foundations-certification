"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
  invocation: ProductDetailsToolInvocation;
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    const id = invocation.input?.productId;
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up{id ? ` "${id}"` : ""}…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if ("error" in output && typeof output.error === "string") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  if (
    typeof output.name !== "string" ||
    typeof output.slug !== "string" ||
    !Array.isArray(output.images) ||
    typeof output.price !== "number" ||
    typeof output.currency !== "string" ||
    typeof output.description !== "string"
  ) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Product details are incomplete.
      </div>
    );
  }

  const image = output.images.find(
    (value): value is string => typeof value === "string",
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {image && (
        <div className="relative aspect-4/3 bg-secondary">
          <Image
            src={image}
            alt={output.name}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-tight">
              {output.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatPrice(output.price, output.currency)}
            </p>
          </div>
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {output.description}
        </p>
        <Link
          href={`/products/${output.slug}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          View product →
        </Link>
      </div>
    </div>
  );
}