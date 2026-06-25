import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/product-form";
import { updateProduct } from "@/app/products/actions";
import type { Product } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const product = data as Product;

  // 본인 글이 아니면 수정 불가 → 상세 페이지로 돌려보냅니다.
  if (product.seller_id !== user.id) redirect(`/products/${id}`);

  // 글 id 를 미리 묶어(bind) 수정 동작을 만듭니다.
  const action = updateProduct.bind(null, id);

  return (
    <ProductForm
      mode="edit"
      action={action}
      cancelHref={`/products/${id}`}
      defaults={{
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        status: product.status,
      }}
    />
  );
}
