# Portfolio

개인 포트폴리오 웹사이트 — Express.js 백엔드 + 정적 프론트엔드 구조

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 백엔드 | Node.js, Express.js 5 |
| 프론트엔드 | HTML, CSS, JavaScript |
| 미들웨어 | cors, dotenv |
| 개발 도구 | nodemon |

---

## 프로젝트 구조

```
portfolio/
├── public/             # 프론트엔드 정적 파일
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── routes/
│   └── index.js        # API 라우터
├── server.js           # Express 서버 진입점
├── .env                # 환경변수 (git 제외)
├── .env.example        # 환경변수 템플릿
└── .gitignore
```

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

`.env` 파일:

```
PORT=3000
```

### 3. 서버 실행

```bash
# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

서버가 실행되면 `http://localhost:3000` 에서 확인할 수 있습니다.

---

## API 엔드포인트

모든 API는 `/api` 접두사를 사용합니다.

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |

### 응답 예시

**GET /api/health**
```json
{ "status": "ok" }
```

---

## 동작 방식

- `/api/...` 경로는 Express 라우터가 처리합니다.
- 그 외 모든 경로는 `public/index.html`을 반환합니다 (SPA 대응).
- `public/` 폴더 내 정적 파일(CSS, JS, 이미지 등)은 자동으로 서빙됩니다.
