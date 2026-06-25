# 🥔 감자마켓 (Potato Market)

> 70~80년대 미국 구제샵 감성의 **프리미엄 빈티지 중고거래 마켓**
> 당근마켓 같은 동네 중고거래를, 시간이 깃든 물건을 위한 무드로.

개발 학습용으로 단계적으로 만들어가는 프로젝트입니다.

## 🧱 기술 스택

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS 기반 테마)
- **Supabase** (인증 + Postgres + RLS)

## ✨ 현재 구현된 기능 (Step 1: 인증)

- 이메일/비밀번호 **회원가입** (닉네임 포함)
- **로그인 / 로그아웃** (서버 액션 + 미들웨어 세션 갱신)
- 가입 시 트리거로 `profiles` 행 자동 생성
- 빈티지 아메리카나 디자인 시스템 (랜딩 / 인증 페이지)

## 🚀 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

### 환경변수

`.env.example` 를 복사해 `.env.local` 을 만들고 값을 채웁니다.
(Supabase 대시보드 → Project Settings → API)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<프로젝트-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
```

> `NEXT_PUBLIC_*` 키는 브라우저에 노출되지만, **RLS(행 수준 보안)** 로 보호되는
> publishable 키라 공개돼도 안전합니다. `service_role` 키는 절대 커밋하지 마세요.

## 🗄️ 데이터베이스

`public.profiles` — 사용자 프로필 (`auth.users` 와 1:1)

| 컬럼 | 설명 |
|------|------|
| `id` (uuid, PK) | `auth.users.id` 참조 (가입 시 트리거로 자동 생성) |
| `nickname` (text) | 표시용 닉네임 |
| `avatar_url` (text) | 프로필 이미지 (추후 사용) |
| `created_at` / `updated_at` | 타임스탬프 |

- RLS 활성화: 프로필은 누구나 조회, 본인만 수정
- 트리거 `on_auth_user_created` 가 가입 시 `nickname` 을 메타데이터에서 읽어 행 생성

## 📧 이메일 인증 설정

기본적으로 Supabase 는 **이메일 인증이 켜져 있어** 가입 후 메일의 링크를 눌러야 로그인됩니다.
학습 중 빠른 테스트를 원하면 대시보드에서 끌 수 있습니다:

`Authentication → Sign In / Providers → Email → "Confirm email" 끄기`

## ☁️ 배포 (Vercel)

1. 이 저장소를 Vercel 에 연결
2. Environment Variables 에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록
3. 배포 후 Supabase `Authentication → URL Configuration` 에 배포 도메인 추가

## 🗺️ 다음 단계 (예정)

- [ ] 상품 등록 / 목록 / 상세
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 동네(지역) 설정, 채팅
