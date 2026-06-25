"use client";

import { deleteProduct } from "@/app/products/actions";

/**
 * 판매글 삭제 버튼.
 * 누르면 한 번 더 확인(confirm)을 받고, 확인하면 서버에서 글을 지웁니다.
 */
export default function DeleteProductButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm("이 판매글을 삭제할까요? 삭제하면 되돌릴 수 없어요.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="eyebrow rounded-sm border border-rust/50 px-4 py-2 text-[11px] text-rust transition-colors hover:bg-rust hover:text-cream"
      >
        삭제
      </button>
    </form>
  );
}
