import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatPrice,
  formatDate,
  STATUS_LABELS,
  STATUS_BADGE_CLASS,
  type ProductWithSeller,
} from "@/lib/products";

// 목록은 항상 최신 데이터를 보여줍니다.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("products")
    .select(
      "id, title, price, category, status, created_at, seller_id, profiles(nickname)",
    )
    .order("created_at", { ascending: false });

  const products = (data ?? []) as unknown as ProductWithSeller[];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      {/* 머리말 + 글쓰기 버튼 */}
      <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-[11px] text-rust">The Market</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-ink sm:text-4xl">
            감자마켓 판매글
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            이웃들이 내놓은 빈티지 물건을 둘러보세요.
          </p>
        </div>
        <Link
          href={user ? "/products/new" : "/login"}
          className="btn-primary self-start whitespace-nowrap sm:self-auto"
        >
          판매 글쓰기
        </Link>
      </div>

      {/* 목록 */}
      {products.length === 0 ? (
        <div className="mt-16 rounded-md bg-card/60 p-12 text-center vintage-frame">
          <p className="font-heading text-xl font-bold text-ink">
            아직 등록된 판매글이 없어요
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            첫 번째 빈티지 물건의 주인을 찾아주세요.
          </p>
          <Link
            href={user ? "/products/new" : "/login"}
            className="btn-primary mt-6 inline-block"
          >
            첫 글 쓰러 가기
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.id}`}
                className="group flex h-full flex-col rounded-md bg-card p-5 ring-1 ring-line/60 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(42,32,23,0.55)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`eyebrow rounded-sm border px-2 py-0.5 text-[9px] ${STATUS_BADGE_CLASS[p.status]}`}
                  >
                    {STATUS_LABELS[p.status]}
                  </span>
                  {p.category && (
                    <span className="text-[11px] text-ink-soft">
                      {p.category}
                    </span>
                  )}
                </div>

                <h2 className="mt-3 line-clamp-2 font-heading text-lg font-bold leading-snug text-ink group-hover:text-rust">
                  {p.title}
                </h2>

                <p className="mt-2 font-accent text-xl font-semibold text-rust-dark">
                  {formatPrice(p.price)}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-ink-soft">
                  <span>{p.profiles?.nickname ?? "익명"}</span>
                  <span>{formatDate(p.created_at)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
