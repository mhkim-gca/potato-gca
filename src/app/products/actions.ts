"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type ProductStatus } from "@/lib/products";

/** 폼 동작의 결과(에러 메시지)를 화면으로 돌려주기 위한 타입 */
export type ProductFormState = { error?: string };

const VALID_STATUS: ProductStatus[] = ["on_sale", "reserved", "sold"];

type ParsedProduct = {
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: ProductStatus;
};

/**
 * 폼에서 들어온 값을 검증하고 정리합니다.
 * 문제가 있으면 { error } 를, 정상이면 정리된 값을 돌려줍니다.
 */
function parseProductForm(
  formData: FormData,
): ParsedProduct | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "on_sale").trim();

  if (title.length < 1) return { error: "제목을 입력해주세요." };
  if (title.length > 100) return { error: "제목은 100자 이내로 입력해주세요." };

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return { error: "가격은 0 이상의 숫자로 입력해주세요." };
  }
  if (price > 1_000_000_000) {
    return { error: "가격이 너무 커요. 다시 확인해주세요." };
  }

  if (!VALID_STATUS.includes(status as ProductStatus)) {
    return { error: "판매 상태 값이 올바르지 않아요." };
  }

  // 카테고리는 미리 정해둔 목록 안의 값만 허용(아니면 비움)
  const category = (CATEGORIES as readonly string[]).includes(categoryRaw)
    ? categoryRaw
    : null;

  return {
    title,
    description: description.length > 0 ? description : null,
    price: Math.floor(price),
    category,
    status: status as ProductStatus,
  };
}

/** 새 판매글 등록 → 성공하면 방금 만든 글의 상세 페이지로 이동 */
export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요해요." };

  const parsed = parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data, error } = await supabase
    .from("products")
    .insert({ ...parsed, seller_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "등록 중 문제가 생겼어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/products");
  redirect(`/products/${data.id}`);
}

/**
 * 판매글 수정. 호출하는 쪽에서 글 id 를 미리 묶어서(bind) 넘깁니다.
 * RLS 와 더불어 seller_id 조건으로 한 번 더 본인 글만 고치도록 막습니다.
 */
export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요해요." };

  const parsed = parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase
    .from("products")
    .update(parsed)
    .eq("id", id)
    .eq("seller_id", user.id);

  if (error) {
    return { error: "수정 중 문제가 생겼어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

/** 판매글 삭제 → 목록으로 이동. 폼의 hidden 입력으로 id 를 받습니다. */
export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/products");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("seller_id", user.id);

  revalidatePath("/products");
  redirect("/products");
}
