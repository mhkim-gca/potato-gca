"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "@/app/auth/actions";

/**
 * 로그인/회원가입 공용 폼.
 * mode 에 따라 닉네임 필드와 동작(서버 액션)이 바뀝니다.
 * useActionState 로 서버 액션의 결과(에러/안내 메시지)를 화면에 보여줍니다.
 */
export default function AuthForm({
  mode,
  initialError,
}: {
  mode: "login" | "signup";
  initialError?: string;
}) {
  const isSignup = mode === "signup";
  const action = isSignup ? signup : login;

  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    action,
    { error: initialError },
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <div className="text-center">
        <p className="eyebrow text-[11px] text-rust">
          {isSignup ? "Join the Market" : "Welcome Back"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-ink">
          {isSignup ? "감자마켓 회원가입" : "감자마켓 로그인"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {isSignup
            ? "빈티지를 사랑하는 이웃이 되어주세요."
            : "다시 만나서 반가워요."}
        </p>
      </div>

      <form
        action={formAction}
        className="mt-8 flex flex-col gap-4 rounded-md bg-card p-7 vintage-frame"
      >
        {isSignup && (
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow text-[10px] text-ink-soft">닉네임</span>
            <input
              name="nickname"
              type="text"
              required
              minLength={2}
              placeholder="감자대장"
              className="field"
              autoComplete="nickname"
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-ink-soft">이메일</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="field"
            autoComplete="email"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-ink-soft">비밀번호</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="6자 이상"
            className="field"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </label>

        {state?.error && (
          <p className="rounded-sm border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-rust-dark">
            {state.error}
          </p>
        )}
        {state?.message && (
          <p className="rounded-sm border border-olive/40 bg-olive/10 px-3 py-2 text-sm text-olive">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={isPending} className="btn-primary mt-1">
          {isPending ? "잠시만요…" : isSignup ? "가입하기" : "로그인"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft">
        {isSignup ? (
          <>
            이미 회원이신가요?{" "}
            <Link href="/login" className="font-semibold text-rust hover:underline">
              로그인
            </Link>
          </>
        ) : (
          <>
            아직 회원이 아니신가요?{" "}
            <Link href="/signup" className="font-semibold text-rust hover:underline">
              회원가입
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
