"use client";

import { useActionState } from "react";
import { createComment, deleteComment } from "@/app/products/actions";
import { formatDate, type Comment } from "@/lib/products";

export default function CommentSection({
  productId,
  comments,
  currentUserId,
}: {
  productId: string;
  comments: Comment[];
  currentUserId: string | null;
}) {
  const boundCreate = createComment.bind(null, productId);
  const [state, formAction, isPending] = useActionState(boundCreate, {});

  return (
    <section className="mt-8 border-t border-line/60 pt-7">
      <h2 className="eyebrow text-[11px] text-ink-soft">
        댓글 {comments.length > 0 ? `· ${comments.length}` : ""}
      </h2>

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <p className="mt-4 text-sm italic text-ink-soft">
          첫 번째 댓글을 남겨보세요.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-sm bg-cream/60 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-ink">
                  {c.profiles?.nickname ?? "익명"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-soft">
                    {formatDate(c.created_at)}
                  </span>
                  {currentUserId === c.user_id && (
                    <form action={deleteComment}>
                      <input type="hidden" name="comment_id" value={c.id} />
                      <input type="hidden" name="product_id" value={productId} />
                      <button
                        type="submit"
                        className="text-[11px] text-ink-soft/60 transition-colors hover:text-rust"
                      >
                        삭제
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                {c.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* 댓글 작성 */}
      {currentUserId ? (
        <form action={formAction} className="mt-5 flex flex-col gap-2">
          {/* key 가 바뀌면 textarea 가 리셋됩니다 */}
          <textarea
            key={state.ts}
            name="content"
            rows={3}
            maxLength={500}
            required
            placeholder="댓글을 남겨주세요. (최대 500자)"
            className="field resize-none"
          />
          {state.error && (
            <p className="text-sm text-rust-dark">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary self-end"
          >
            {isPending ? "등록 중…" : "댓글 등록"}
          </button>
        </form>
      ) : (
        <p className="mt-5 text-sm text-ink-soft">
          <a href="/login" className="font-semibold text-rust hover:underline">
            로그인
          </a>
          하면 댓글을 남길 수 있어요.
        </p>
      )}
    </section>
  );
}
