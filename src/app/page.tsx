import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nickname: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();
    nickname = profile?.nickname ?? null;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      {/* 히어로 */}
      <section className="text-center">
        <p className="eyebrow text-xs text-rust">
          Premium Vintage Market · 1974
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-ink sm:text-6xl">
          오래된 물건에는
          <br />
          <span className="text-rust">이야기</span>가 깃들어 있어요
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-ink-soft sm:text-lg">
          70~80년대 미국 구제샵의 감성으로 꾸민 프리미엄 중고마켓.
          <br className="hidden sm:block" />
          누군가의 손때 묻은 물건을 다음 주인에게 건네보세요.
        </p>

        {user ? (
          <div className="mx-auto mt-10 max-w-md rounded-md bg-card p-7 vintage-frame">
            <p className="eyebrow text-[11px] text-olive">Welcome back</p>
            <p className="mt-2 font-heading text-2xl font-bold text-ink">
              {nickname ?? "감자"}님, 다시 오셨군요
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              로그인된 상태예요. 이제 물건을 사고팔 수 있어요.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/products" className="btn-primary">
                마켓 둘러보기
              </Link>
              <Link
                href="/products/new"
                className="eyebrow rounded-sm border border-line px-5 py-3 text-xs text-ink transition-colors hover:border-rust hover:text-rust"
              >
                판매 글쓰기
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary w-full sm:w-auto">
              지금 가입하기
            </Link>
            <Link
              href="/login"
              className="eyebrow w-full rounded-sm border border-line px-5 py-3 text-xs text-ink transition-colors hover:border-rust hover:text-rust sm:w-auto"
            >
              로그인
            </Link>
            <Link
              href="/products"
              className="eyebrow w-full px-5 py-3 text-xs text-ink-soft underline-offset-4 transition-colors hover:text-rust hover:underline sm:w-auto"
            >
              마켓 구경하기
            </Link>
          </div>
        )}
      </section>

      {/* 컨셉 3분할 */}
      <section className="mt-20 grid gap-6 border-t border-line/70 pt-12 sm:grid-cols-3">
        {[
          {
            tag: "Curated",
            title: "골라낸 빈티지",
            body: "아무 물건이 아니라, 시간이 만든 멋이 있는 물건을 위한 자리.",
          },
          {
            tag: "Local",
            title: "동네 직거래",
            body: "가까운 이웃과 만나 안전하게 거래하는 따뜻한 중고 문화.",
          },
          {
            tag: "Honest",
            title: "정직한 상태표시",
            body: "낡음도 멋이 되도록, 물건의 상태를 솔직하게 보여줘요.",
          },
        ].map((c) => (
          <div key={c.tag} className="rounded-md bg-card/60 p-6">
            <p className="eyebrow text-[10px] text-rust">{c.tag}</p>
            <h3 className="mt-2 font-heading text-xl font-bold text-ink">
              {c.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
