import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버(서버 컴포넌트 / 서버 액션 / Route Handler)에서 사용하는 Supabase 클라이언트.
 * Next.js 16 에서 cookies() 는 비동기이므로 반드시 await 해야 합니다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 서버 컴포넌트에서 호출되면 set 이 막힐 수 있습니다.
            // 미들웨어가 세션 쿠키를 갱신해 주므로 여기서는 무시해도 됩니다.
          }
        },
      },
    },
  );
}
