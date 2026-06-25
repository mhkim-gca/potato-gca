import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "@/components/delete-product-button";
import LikeButton from "@/components/like-button";
import CommentSection from "@/components/comment-section";
import {
  formatPrice,
  formatDate,
  STATUS_LABELS,
  STATUS_BADGE_CLASS,
  type ProductWithSeller,
  type Comment,
} from "@/lib/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 상품·좋아요·댓글을 한꺼번에 불러옵니다.
  const [productRes, likesRes, commentsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, profiles(nickname)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("likes")
      .select("id, user_id")
      .eq("product_id", id),
    supabase
      .from("comments")
      .select("id, content, created_at, user_id, profiles(nickname)")
      .eq("product_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (productRes.error || !productRes.data) notFound();

  const product = productRes.data as unknown as ProductWithSeller;
  const likes = likesRes.data ?? [];
  const comments = (commentsRes.data ?? []) as unknown as Comment[];

  const isOwner = user?.id === product.seller_id;
  const likeCount = likes.length;
  const isLiked = likes.some((l) => l.user_id === user?.id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <Link
        href="/products"
        className="eyebrow text-[11px] text-ink-soft transition-colors hover:text-rust"
      >
        ← 목록으로
      </Link>

      <article className="mt-5 rounded-md bg-card vintage-frame overflow-hidden">
        {/* 상품 이미지 */}
        {product.image_url && (
          <div className="relative h-72 w-full sm:h-96">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
              priority
            />
          </div>
        )}

        <div className="p-7 sm:p-9">
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

          <div className="mt-5 flex items-center justify-between gap-2 border-y border-line/60 py-3">
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <span className="font-semibold text-ink">
                {product.profiles?.nickname ?? "익명"}
              </span>
              <span>·</span>
              <span>{formatDate(product.created_at)}</span>
            </div>

            {/* 좋아요 버튼 */}
            <LikeButton
              productId={product.id}
              initialCount={likeCount}
              initialLiked={isLiked}
              isLoggedIn={!!user}
            />
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

          {/* 댓글 영역 */}
          <CommentSection
            productId={product.id}
            comments={comments}
            currentUserId={user?.id ?? null}
          />
        </div>
      </article>
    </div>
  );
}
