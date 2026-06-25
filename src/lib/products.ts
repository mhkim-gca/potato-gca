// 판매글(상품) 기능에서 서버·클라이언트가 함께 쓰는 공용 타입과 상수.
// 여기에는 DB 접근 같은 "서버 전용" 코드는 넣지 않습니다(클라이언트에서도 import 하므로).

export type ProductStatus = "on_sale" | "reserved" | "sold";

/** products 테이블 한 줄에 해당하는 판매글 데이터 */
export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

/** 목록/상세에서 작성자 닉네임을 함께 불러왔을 때의 형태 */
export type ProductWithSeller = Product & {
  profiles: { nickname: string | null } | null;
};

/** 카테고리 선택지 (빈티지 마켓에 맞춘 분류) */
export const CATEGORIES = [
  "의류",
  "잡화·액세서리",
  "가구·리빙",
  "전자기기",
  "음반·도서",
  "기타",
] as const;

/** 판매 상태 선택지 */
export const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "on_sale", label: "판매중" },
  { value: "reserved", label: "예약중" },
  { value: "sold", label: "판매완료" },
];

/** 상태 코드 → 한글 라벨 */
export const STATUS_LABELS: Record<ProductStatus, string> = {
  on_sale: "판매중",
  reserved: "예약중",
  sold: "판매완료",
};

/** 상태별 배지(badge) 색상 클래스 */
export const STATUS_BADGE_CLASS: Record<ProductStatus, string> = {
  on_sale: "border-olive/30 bg-olive/15 text-olive",
  reserved: "border-gold/50 bg-gold/20 text-rust-dark",
  sold: "border-line bg-ink/10 text-ink-soft",
};

/** 9000 → "9,000원", 0 → "나눔(무료)" */
export function formatPrice(price: number): string {
  if (price === 0) return "나눔(무료)";
  return `${price.toLocaleString("ko-KR")}원`;
}

/** ISO 날짜 문자열 → "2026.06.25" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
