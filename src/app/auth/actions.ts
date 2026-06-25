"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  message?: string;
};

/** 로그인: 성공하면 홈으로 이동, 실패하면 에러 메시지 반환 */
export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않아요." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/** 회원가입: 이메일 인증이 꺼져 있으면 바로 로그인 처리, 켜져 있으면 안내 메시지 */
export async function signup(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();

  if (nickname.length < 2) {
    return { error: "닉네임은 2자 이상 입력해주세요." };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상으로 만들어주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // 여기에 넣은 nickname 은 트리거가 profiles 테이블에 자동 저장합니다.
    options: { data: { nickname } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "이미 가입된 이메일이에요." };
    }
    return { error: error.message };
  }

  // 이메일 인증이 꺼져 있으면 세션이 바로 발급됩니다 → 홈으로
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  // 이메일 인증이 켜져 있는 경우
  return {
    message: "가입 확인 메일을 보냈어요. 메일함에서 링크를 눌러 인증을 완료해주세요.",
  };
}

/** 로그아웃 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
