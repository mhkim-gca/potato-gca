import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/product-form";
import { createProduct } from "@/app/products/actions";

// 로그인한 사용자만 글을 쓸 수 있는 페이지.
export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않았으면 로그인 페이지로 보냅니다.
  if (!user) redirect("/login");

  return (
    <ProductForm mode="new" action={createProduct} cancelHref="/products" />
  );
}
