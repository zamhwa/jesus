import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const docsDir = path.join(rootDir, "docs");
const siteUrl = "https://drainkorea.com";

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function renderIndex() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>배관 문제 해결 리소스 센터</title>
  <meta name="description" content="하수구, 변기, 싱크대, 역류 문제를 지역별로 빠르게 확인할 수 있는 리소스 허브입니다.">
  <link rel="canonical" href="${siteUrl}/resources/">
  <style>
    body{font-family:'Noto Sans KR',Arial,sans-serif;max-width:980px;margin:0 auto;padding:24px;line-height:1.75}
    .card{border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin:10px 0;background:#f8fafc}
    a{color:#0369a1}
  </style>
</head>
<body>
  <h1>배관 문제 해결 리소스 센터</h1>
  <p>외부 커뮤니티/디렉토리/협력사에서 참고하기 쉬운 공식 리소스 모음입니다.</p>
  <div class="card">
    <h2>핵심 서비스 페이지</h2>
    <p><a href="/seo/">수도권 지역별 SEO 페이지 모음</a></p>
  </div>
  <div class="card">
    <h2>정보형 콘텐츠</h2>
    <p><a href="/blog/">배관 관리 블로그</a></p>
    <p><a href="/resources/press-kit/">보도자료/소개문</a></p>
    <p><a href="/resources/case-studies/">작업 사례 아카이브</a></p>
  </div>
  <div class="card">
    <h2>공식 기술 자료</h2>
    <p><a href="/resources/maintenance-checklist/">월간 점검 체크리스트</a></p>
    <p><a href="/resources/service-areas/">서비스 지역 안내</a></p>
  </div>
</body>
</html>`;
}

function renderSimplePage(title, description, body) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    body{font-family:'Noto Sans KR',Arial,sans-serif;max-width:900px;margin:0 auto;padding:24px;line-height:1.8}
    .box{border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:#f8fafc}
    a{color:#0369a1}
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <div class="box">${body}</div>
  <p><a href="/resources/">리소스 센터</a> | <a href="/seo/">SEO 페이지</a> | <a href="/blog/">블로그</a></p>
</body>
</html>`;
}

function buildBacklinkTargetsCsv() {
  const rows = [
    ["platform","type","url","status","anchor_text","target_url","note"],
    ["Google Business Profile","local-profile","https://www.google.com/business/","pending","강남구 하수구 막힘","https://drainkorea.com/seo/","비즈니스 정보 일치 유지"],
    ["Naver Place","local-profile","https://place.naver.com/","pending","수도권 배관 긴급 출동","https://drainkorea.com/seo/","NAP 일관성 필수"],
    ["Kakao Map Place","local-profile","https://place.map.kakao.com/","pending","하수구 막힘 24시간","https://drainkorea.com/seo/","영업시간/전화번호 검증"],
    ["Naver Blog","content","https://blog.naver.com/","pending","하수구 막힘 원인과 해결","https://drainkorea.com/blog/","정보형 글 우선"],
    ["Brunch","content","https://brunch.co.kr/","pending","배관 관리 체크리스트","https://drainkorea.com/resources/maintenance-checklist/","브랜드 스토리형"],
    ["Medium","content","https://medium.com/","pending","Korea plumbing emergency checklist","https://drainkorea.com/resources/","영문 보조 노출"],
    ["티스토리","content","https://www.tistory.com/","pending","변기 막힘 비용 가이드","https://drainkorea.com/blog/","중복 문장 지양"],
    ["워드프레스닷컴","content","https://wordpress.com/","pending","싱크대 막힘 빠른 해결","https://drainkorea.com/blog/","자연 링크 1~2개"],
    ["Notion 공개페이지","resource","https://www.notion.so/","pending","수도권 서비스 지역","https://drainkorea.com/resources/service-areas/","허브 링크용"],
    ["YouTube 설명란","social","https://www.youtube.com/","pending","작업 사례 모음","https://drainkorea.com/resources/case-studies/","영상 1개당 링크 1개"]
  ];
  return `${rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")}\n`;
}

function buildBacklinkTrackerCsv() {
  const rows = [
    ["date","platform","submitted_url","target_url","anchor_text","index_status","traffic","note"],
    ["","","","","","pending","",""]
  ];
  return `${rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")}\n`;
}

function run() {
  const resourcesDir = path.join(docsDir, "resources");
  ensureDir(resourcesDir);

  write(path.join(resourcesDir, "index.html"), renderIndex());

  write(
    path.join(resourcesDir, "press-kit", "index.html"),
    renderSimplePage(
      "제우스설비 소개 자료",
      "지역 기반 배관 긴급 출동 서비스 소개 자료입니다.",
      "<p>제우스설비는 수도권 지역에서 하수구 막힘, 변기 막힘, 싱크대 막힘, 배관 고압세척, 역류 문제를 긴급 대응합니다.</p><p>표준 공정: 접수 → 진단 → 원인 제거 → 세척 → 점검</p>"
    )
  );

  write(
    path.join(resourcesDir, "case-studies", "index.html"),
    renderSimplePage(
      "작업 사례 아카이브",
      "지역별 주요 작업 유형과 대응 포인트를 정리한 사례 페이지입니다.",
      "<ul><li>강남구 싱크대 막힘: 기름 슬러지 제거 + 유량 점검</li><li>수원 변기 막힘: 내시경 진단 후 단계별 제거</li><li>인천 역류: 오염 구간 세척 및 재발 방지 안내</li></ul>"
    )
  );

  write(
    path.join(resourcesDir, "maintenance-checklist", "index.html"),
    renderSimplePage(
      "월간 배관 점검 체크리스트",
      "주거/상가 공통으로 쓸 수 있는 월간 점검 항목입니다.",
      "<ol><li>배수 속도 체크</li><li>악취 여부 확인</li><li>배수구 거름망 청소</li><li>기름류 분리 배출 확인</li><li>필요 시 전문가 점검 예약</li></ol>"
    )
  );

  write(
    path.join(resourcesDir, "service-areas", "index.html"),
    renderSimplePage(
      "수도권 서비스 지역 안내",
      "서울/경기/인천 지역 기반 출동 서비스를 제공합니다.",
      "<p>SEO 페이지 허브에서 동 단위 지역 페이지를 확인할 수 있습니다: <a href='/seo/'>지역 페이지 보기</a></p>"
    )
  );

  write(path.join(docsDir, "backlink-targets.csv"), buildBacklinkTargetsCsv());
  write(path.join(docsDir, "backlink-tracker.csv"), buildBacklinkTrackerCsv());

  console.log("Backlink assets generated:");
  console.log("- docs/resources/*");
  console.log("- docs/backlink-targets.csv");
  console.log("- docs/backlink-tracker.csv");
}

run();
