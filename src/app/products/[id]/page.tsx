import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "@/components/delete-product-button";
import {
  formatPrice,
  formatDate,
  STATUS_LABELS,
  STATUS_BADGE_CLASS,
  type ProductWithSeller,
} from "@/lib/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("products")
    .select("*, profiles(nickname)")
    .eq("id", id)
    .maybeSingle();

  // 없는 글이거나 잘못된 주소면 404 페이지로
  if (error || !data) notFound();

  const product = data as unknown as ProductWithSeller;
  const isOwner = user?.id === product.seller_id;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <Link
        href="/products"
        className="eyebrow text-[11px] text-ink-soft transition-colors hover:text-rust"
      >
        ← 목록으로
      </Link>

      <article className="mt-5 rounded-md bg-card p-7 vintage-frame sm:p-9">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`eyebrow rounded-sm border px-2.5 py-1 text-[10px] ${STATUS_BADGE_CLASS[product.status]}`}
          >
            {STATUS_LABELS[product.status]}
          </span>
          {product.category && (
            <span className="text-xs text-ink-soft">{product.category}</span>
          )}
        </div>

        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-ink">
          {product.title}
        </h1>

        <p className="mt-3 font-accent text-3xl font-bold text-rust-dark">
          {formatPrice(product.price)}
        </p>

        <div className="mt-5 flex items-center gap-2 border-y border-line/60 py-3 text-sm text-ink-soft">
          <span className="font-semibold text-ink">
            {product.profiles?.nickname ?? "익명"}
          </span>
          <span>·</span>
          <span>{formatDate(product.created_at)}</span>
        </div>

        {product.description ? (
          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
            {product.description}
          </p>
        ) : (
          <p className="mt-5 text-sm italic text-ink-soft">
            설명이 없는 물건이에요.
          </p>
        )}

        {/* 작성자 본인에게만 보이는 수정/삭제 버튼 */}
        {isOwner && (
          <div className="mt-8 flex items-center gap-3 border-t border-line/60 pt-6">
            <Link
              href={`/products/${product.id}/edit`}
              className="eyebrow rounded-sm border border-line px-4 py-2 text-[11px] text-ink transition-colors hover:border-rust hover:text-rust"
            >
              수정
            </Link>
            <DeleteProductButton id={product.id} />
          </div>
        )}
      </article>
    </div>
  );
}
