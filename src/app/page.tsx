import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RetroBadge from "@/components/retro-badge";

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
    <div>
      {/* 히어로 — 선버스트 배경 */}
      <section className="retro-sunburst-bg px-5 py-14 text-center sm:py-20">
        <div className="mx-auto max-w-2xl">
          {/* 레트로 씰 배지 */}
          <div className="flex justify-center mb-6">
            <RetroBadge />
          </div>

          <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl">
            오래된 물건에는
            <br />
            <span className="text-rust">이야기</span>가 깃들어 있어요
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
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
        </div>
      </section>

      {/* 장식 구분선 */}
      <div className="retro-divider mx-auto max-w-5xl px-8 py-10">
        The Market
      </div>

      {/* 컨셉 3분할 */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              no: "01",
              tag: "Curated",
              title: "골라낸 빈티지",
              body: "아무 물건이 아니라, 시간이 만든 멋이 있는 물건을 위한 자리.",
            },
            {
              no: "02",
              tag: "Local",
              title: "동네 직거래",
              body: "가까운 이웃과 만나 안전하게 거래하는 따뜻한 중고 문화.",
            },
            {
              no: "03",
              tag: "Honest",
              title: "정직한 상태표시",
              body: "낡음도 멋이 되도록, 물건의 상태를 솔직하게 보여줘요.",
            },
          ].map((c) => (
            <div
              key={c.tag}
              className="relative rounded-md bg-card/60 p-7 ring-1 ring-line/50"
            >
              <span className="font-accent text-4xl font-bold leading-none text-rust/20">
                {c.no}
              </span>
              <p className="eyebrow mt-3 text-[10px] text-rust">{c.tag}</p>
              <h3 className="mt-2 font-heading text-xl font-bold text-ink">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {c.body}
              </p>
              <span className="absolute bottom-3 right-4 text-[10px] text-gold/50">
                ✦
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 레트로 광고 스트립 */}
      <section className="retro-ad-strip px-5 py-16 text-center">
        <p className="eyebrow text-[11px] text-cream/70">
          Vintage Market · Seoul · Est. 1974
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold text-cream sm:text-4xl">
          오늘의 감자마켓에서
          <br />
          새 주인을 기다리는 물건들
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/80">
          골동품부터 소소한 빈티지 소품까지.
          <br />
          시간이 깃든 물건이 여기 있어요.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-sm border-2 border-cream/80 px-8 py-3 font-accent text-sm font-semibold uppercase tracking-widest text-cream transition-colors hover:bg-cream hover:text-rust"
        >
          마켓 둘러보기 →
        </Link>
      </section>
    </div>
  );
}
