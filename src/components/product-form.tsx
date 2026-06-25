"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  CATEGORIES,
  STATUS_OPTIONS,
  type ProductStatus,
} from "@/lib/products";
import type { ProductFormState } from "@/app/products/actions";

type FormAction = (
  state: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

export type ProductFormDefaults = {
  title?: string;
  description?: string | null;
  price?: number;
  category?: string | null;
  status?: ProductStatus;
};

/**
 * 판매글 작성/수정 공용 폼.
 * - mode "new": 새 글 작성 (상태는 자동으로 '판매중')
 * - mode "edit": 기존 글 수정 (판매 상태도 바꿀 수 있음)
 * useActionState 로 서버 동작의 결과(에러 메시지)를 화면에 보여줍니다.
 */
export default function ProductForm({
  action,
  mode,
  defaults,
  cancelHref,
}: {
  action: FormAction;
  mode: "new" | "edit";
  defaults?: ProductFormDefaults;
  cancelHref: string;
}) {
  const isEdit = mode === "edit";
  const [state, formAction, isPending] = useActionState<
    ProductFormState,
    FormData
  >(action, {});

  return (
    <div className="mx-auto flex max-w-xl flex-col px-5 py-12 sm:py-16">
      <div className="text-center">
        <p className="eyebrow text-[11px] text-rust">
          {isEdit ? "Edit Listing" : "New Listing"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-ink">
          {isEdit ? "판매글 수정" : "판매글 쓰기"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {isEdit
            ? "내용을 고치고 저장하면 바로 반영돼요."
            : "팔고 싶은 물건의 이야기를 들려주세요."}
        </p>
      </div>

      <form
        action={formAction}
        className="mt-8 flex flex-col gap-4 rounded-md bg-card p-7 vintage-frame"
      >
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-ink-soft">제목</span>
          <input
            name="title"
            type="text"
            required
            maxLength={100}
            defaultValue={defaults?.title ?? ""}
            placeholder="예) 70년대 미국 가죽 자켓"
            className="field"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-ink-soft">카테고리</span>
          <select
            name="category"
            defaultValue={defaults?.category ?? ""}
            className="field"
          >
            <option value="">선택 안 함</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-ink-soft">
            가격 (원, 0이면 나눔)
          </span>
          <input
            name="price"
            type="number"
            required
            min={0}
            step={100}
            inputMode="numeric"
            defaultValue={defaults?.price ?? 0}
            placeholder="0"
            className="field"
          />
        </label>

        {isEdit && (
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow text-[10px] text-ink-soft">판매 상태</span>
            <select
              name="status"
              defaultValue={defaults?.status ?? "on_sale"}
              className="field"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-ink-soft">설명</span>
          <textarea
            name="description"
            rows={6}
            maxLength={2000}
            defaultValue={defaults?.description ?? ""}
            placeholder="물건의 상태, 사용 기간, 거래 방법 등을 솔직하게 적어주세요."
            className="field resize-y"
          />
        </label>

        {state?.error && (
          <p className="rounded-sm border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-rust-dark">
            {state.error}
          </p>
        )}

        <div className="mt-1 flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary flex-1"
          >
            {isPending ? "저장하는 중…" : isEdit ? "수정 저장" : "등록하기"}
          </button>
          <Link
            href={cancelHref}
            className="eyebrow rounded-sm border border-line px-5 py-3 text-[11px] text-ink-soft transition-colors hover:border-rust hover:text-rust"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
