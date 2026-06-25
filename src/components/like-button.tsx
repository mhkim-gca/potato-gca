"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/products/actions";

export default function LikeButton({
  productId,
  initialCount,
  initialLiked,
  isLoggedIn,
}: {
  productId: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
}) {
  const [optimistic, addOptimistic] = useOptimistic(
    { count: initialCount, liked: initialLiked },
    (cur) => ({
      count: cur.liked ? cur.count - 1 : cur.count + 1,
      liked: !cur.liked,
    }),
  );
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      addOptimistic(undefined);
      await toggleLike(productId);
    });
  }

  const label = optimistic.liked ? "♥ 좋아요 취소" : "♡ 좋아요";

  if (!isLoggedIn) {
    return (
      <span className="eyebrow flex items-center gap-1.5 rounded-sm border border-line px-4 py-2 text-[11px] text-ink-soft">
        ♡ {optimistic.count > 0 ? optimistic.count : ""}
        <span className="hidden sm:inline">좋아요</span>
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`eyebrow rounded-sm border px-4 py-2 text-[11px] transition-colors ${
        optimistic.liked
          ? "border-rust bg-rust/10 text-rust"
          : "border-line text-ink-soft hover:border-rust hover:text-rust"
      }`}
    >
      {label}
      {optimistic.count > 0 && ` ${optimistic.count}`}
    </button>
  );
}
