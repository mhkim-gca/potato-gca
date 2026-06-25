import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

/**
 * 모든 페이지 상단에 보이는 헤더.
 * 로그인 상태면 닉네임 + 로그아웃, 아니면 로그인/회원가입 버튼을 보여줍니다.
 */
export default async function SiteHeader() {
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
    <header className="border-b border-line/80 bg-paper/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-heading text-2xl font-bold tracking-tight text-ink">
            감자마켓
          </span>
          <span className="eyebrow hidden text-[10px] text-rust sm:inline">
            Vintage Goods · Est. 1974
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-ink-soft sm:inline">
                <span className="font-semibold text-ink">{nickname ?? "감자"}</span>
                님, 어서오세요
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="eyebrow rounded-sm border border-line px-3 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-rust hover:text-rust"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="eyebrow text-[11px] text-ink-soft transition-colors hover:text-rust"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="eyebrow rounded-sm bg-ink px-3 py-1.5 text-[11px] text-cream transition-colors hover:bg-rust"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
