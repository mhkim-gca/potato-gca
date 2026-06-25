"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type ProductStatus } from "@/lib/products";

export type ProductFormState = { error?: string };
export type CommentFormState = { error?: string; ts?: number };

const VALID_STATUS: ProductStatus[] = ["on_sale", "reserved", "sold"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

// ─── 이미지 업로드 / 삭제 헬퍼 ───────────────────────────────────────────────

async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  userId: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) return null;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}

async function deleteImage(
  supabase: SupabaseClient,
  imageUrl: string | null,
): Promise<void> {
  if (!imageUrl) return;
  try {
    const url = new URL(imageUrl);
    const marker = "/storage/v1/object/public/product-images/";
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return;
    const path = decodeURIComponent(url.pathname.slice(idx + marker.length));
    await supabase.storage.from("product-images").remove([path]);
  } catch {
    // 이미지 삭제 실패는 무시 (글 삭제 자체는 계속 진행)
  }
}

// ─── 판매글 CRUD ──────────────────────────────────────────────────────────────

type ParsedProduct = {
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: ProductStatus;
};

function parseProductForm(formData: FormData): ParsedProduct | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "on_sale").trim();

  if (title.length < 1) return { error: "제목을 입력해주세요." };
  if (title.length > 100) return { error: "제목은 100자 이내로 입력해주세요." };

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0)
    return { error: "가격은 0 이상의 숫자로 입력해주세요." };
  if (price > 1_000_000_000)
    return { error: "가격이 너무 커요. 다시 확인해주세요." };

  if (!VALID_STATUS.includes(status as ProductStatus))
    return { error: "판매 상태 값이 올바르지 않아요." };

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

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요해요." };

  const parsed = parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const imageFile = formData.get("image") as File | null;
  const imageUrl = imageFile ? await uploadImage(supabase, imageFile, user.id) : null;

  if (imageFile && imageFile.size > 0 && !imageUrl) {
    return { error: "사진 업로드에 실패했어요. JPG·PNG·WEBP·GIF, 5MB 이하만 가능해요." };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({ ...parsed, seller_id: user.id, image_url: imageUrl })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "등록 중 문제가 생겼어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/products");
  redirect(`/products/${data.id}`);
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요해요." };

  const parsed = parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  // 기존 글을 먼저 가져와서 이미지 URL 을 확인합니다.
  const { data: existing } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (!existing) return { error: "글을 찾을 수 없거나 권한이 없어요." };

  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = existing.image_url ?? null;

  if (imageFile && imageFile.size > 0) {
    const newUrl = await uploadImage(supabase, imageFile, user.id);
    if (!newUrl) {
      return { error: "사진 업로드에 실패했어요. JPG·PNG·WEBP·GIF, 5MB 이하만 가능해요." };
    }
    // 새 사진 업로드 성공 → 기존 사진 삭제
    await deleteImage(supabase, existing.image_url ?? null);
    imageUrl = newUrl;
  }

  const { error } = await supabase
    .from("products")
    .update({ ...parsed, image_url: imageUrl })
    .eq("id", id)
    .eq("seller_id", user.id);

  if (error) {
    return { error: "수정 중 문제가 생겼어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/products");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .eq("seller_id", user.id)
    .maybeSingle();

  // 글 삭제 전에 스토리지 이미지도 함께 삭제
  if (existing) await deleteImage(supabase, existing.image_url ?? null);

  await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("seller_id", user.id);

  revalidatePath("/products");
  redirect("/products");
}

// ─── 좋아요 ───────────────────────────────────────────────────────────────────

export async function toggleLike(productId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("likes").insert({ product_id: productId, user_id: user.id });
  }

  revalidatePath(`/products/${productId}`);
}

// ─── 댓글 ─────────────────────────────────────────────────────────────────────

export async function createComment(
  productId: string,
  prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요해요." };

  const content = String(formData.get("content") ?? "").trim();
  if (content.length === 0) return { error: "댓글 내용을 입력해주세요." };
  if (content.length > 500) return { error: "댓글은 500자 이내로 입력해주세요." };

  const { error } = await supabase
    .from("comments")
    .insert({ product_id: productId, user_id: user.id, content });

  if (error) return { error: "댓글 등록에 실패했어요. 잠시 후 다시 시도해주세요." };

  revalidatePath(`/products/${productId}`);
  // ts 가 바뀌면 클라이언트에서 textarea 를 리셋합니다
  return { ts: Date.now() };
}

export async function deleteComment(formData: FormData): Promise<void> {
  const commentId = String(formData.get("comment_id") ?? "").trim();
  const productId = String(formData.get("product_id") ?? "").trim();
  if (!commentId || !productId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  revalidatePath(`/products/${productId}`);
}
