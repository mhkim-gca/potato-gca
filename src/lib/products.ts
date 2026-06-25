// 판매글(상품) 기능에서 서버·클라이언트가 함께 쓰는 공용 타입과 상수.

export type ProductStatus = "on_sale" | "reserved" | "sold";

export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: ProductStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductWithSeller = Product & {
  profiles: { nickname: string | null } | null;
};

export type Comment = {
  id: string;
  product_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { nickname: string | null } | null;
};

export const CATEGORIES = [
  "의류",
  "잡화·액세서리",
  "가구·리빙",
  "전자기기",
  "음반·도서",
  "기타",
] as const;

export const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "on_sale", label: "판매중" },
  { value: "reserved", label: "예약중" },
  { value: "sold", label: "판매완료" },
];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  on_sale: "판매중",
  reserved: "예약중",
  sold: "판매완료",
};

export const STATUS_BADGE_CLASS: Record<ProductStatus, string> = {
  on_sale: "border-olive/30 bg-olive/15 text-olive",
  reserved: "border-gold/50 bg-gold/20 text-rust-dark",
  sold: "border-line bg-ink/10 text-ink-soft",
};

export function formatPrice(price: number): string {
  if (price === 0) return "나눔(무료)";
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
