import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 모든 요청마다 실행되어 만료된 세션 토큰을 갱신합니다.
 * (Supabase 공식 Next.js SSR 가이드 패턴)
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 중요: createServerClient 와 getUser() 사이에 다른 코드를 넣지 마세요.
  // 세션이 무작위로 로그아웃되는 디버깅하기 어려운 버그를 막아줍니다.
  await supabase.auth.getUser();

  return supabaseResponse;
}
