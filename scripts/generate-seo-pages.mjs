import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const docsDir = path.join(rootDir, "docs");
const dataDir = path.join(docsDir, "seo-data");
const regions = JSON.parse(fs.readFileSync(path.join(dataDir, "regions.json"), "utf8"));
const keywords = JSON.parse(fs.readFileSync(path.join(dataDir, "keywords.json"), "utf8"));
const siteUrl = "https://drainkorea.com";
const phone = "010-4406-1788";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function serviceIntent(serviceLabel) {
  const map = {
    하수구막힘: "배수 지연과 악취를 빠르게 해결",
    변기막힘: "역류 전 단계에서 즉시 복구",
    싱크대막힘: "주방 배수관 기름때와 슬러지 제거",
    고압세척: "배관 내부를 고압 세척으로 복원",
    역류: "재발성 역류 원인 추적 및 예방"
  };
  return map[serviceLabel] || "배관 문제를 빠르게 해결";
}

function paragraph(city, district, serviceLabel, seed) {
  const p1 = `${city} ${district} ${serviceLabel} 문의는 생활 배수량이 집중되는 시간대에 급격히 증가합니다. 현장에 도착하면 먼저 배수 속도와 역류 흔적을 확인하고, 막힘 구간을 내시경으로 점검해 오진 없이 원인을 특정합니다. ${city} ${district}은 건물 연식과 배관 구조가 다양해 같은 증상도 해결 방식이 달라질 수 있어, 표준 공정과 맞춤 공정을 함께 적용합니다.`;
  const p2 = `${city} ${district} ${serviceLabel}의 주요 원인은 기름 슬러지, 비누 찌꺼기, 머리카락, 이물질 누적입니다. 단순 뚫음만 진행하면 단기간 재발 가능성이 높기 때문에, 제우스설비는 막힘 제거 후 유량 테스트까지 마무리해 실제 사용 조건에서 다시 막히지 않는지 점검합니다.`;
  const p3 = `${city} ${district} ${serviceLabel} 현장은 접수 후 30분 내 출동을 목표로 운영되며, 작업 전 예상 범위를 먼저 설명하고 동의 후 진행합니다. 야간과 주말에도 동일하게 대응해 긴급 상황에서 대기 시간을 줄이고, 작업 후에는 재발 방지를 위한 사용 가이드를 제공해 관리 부담을 낮춥니다.`;
  const p4 = `${city} ${district} ${serviceLabel} 재발 방지 핵심은 배수구 관리 루틴입니다. 월 단위 점검, 거름망 청소, 기름류 분리 배출만 유지해도 막힘 빈도를 크게 줄일 수 있습니다. ${serviceIntent(serviceLabel)}가 필요한 경우 정기 점검까지 연계해 운영 리스크를 줄입니다.`;
  return [p1, p2, p3, p4, p1, p2].slice(seed % 2, seed % 2 + 5).join("\n\n");
}

function renderPage({ citySlug, districtSlug, serviceSlug, cityLabel, districtLabel, serviceLabel }) {
  const seed = `${citySlug}${districtSlug}${serviceSlug}`.length;
  const body = paragraph(cityLabel, districtLabel, serviceLabel, seed);
  const title = `${cityLabel} ${districtLabel} ${serviceLabel} | 30분 출동 24시간 상담`;
  const description = `${cityLabel} ${districtLabel} ${serviceLabel} 전문팀이 빠르게 출동하여 원인 진단부터 재발 방지까지 처리합니다.`;
  const canonical = `${siteUrl}/seo/${citySlug}/${districtSlug}/${serviceSlug}/`;
  const faq = `
  <h2>FAQ</h2>
  <div class="faq-item"><h3>${cityLabel} ${districtLabel} ${serviceLabel} 30분 출동 가능한가요?</h3><p>실시간 배차 시스템으로 근접팀을 우선 배정해 도착 시간을 빠르게 안내합니다.</p></div>
  <div class="faq-item"><h3>야간에도 작업 가능한가요?</h3><p>24시간 접수/출동 체계로 심야와 주말에도 동일하게 대응합니다.</p></div>
  <div class="faq-item"><h3>재발하면 어떻게 하나요?</h3><p>원인 구간 재점검 후 단계별 작업으로 재발률을 낮추는 방식으로 처리합니다.</p></div>`;

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${cityLabel} ${districtLabel} ${serviceLabel} 출동센터`,
    areaServed: `${cityLabel} ${districtLabel}`,
    telephone: phone,
    url: canonical
  })}</script>
  <style>
    body { font-family: 'Noto Sans KR', Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px; line-height: 1.7; color:#0f172a; }
    .badge { display:inline-block; background:#fee2e2; color:#b91c1c; padding:6px 12px; border-radius:999px; font-weight:700; }
    .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin:16px 0; }
    .cta { display:inline-block; margin-top:12px; background:#dc2626; color:#fff; padding:12px 20px; border-radius:10px; font-weight:700; text-decoration:none; }
    .links a { display:block; margin:6px 0; color:#0369a1; }
  </style>
</head>
<body>
  <h1>${cityLabel} ${districtLabel} ${serviceLabel}</h1>
  <p class="badge">긴급성: 30분 출동 / 24시간 상담</p>
  <div class="card">
    <h2>문제 상황 설명</h2>
    <p>${body.split("\n\n")[0]}</p>
    <h2>원인 분석</h2>
    <p>${body.split("\n\n")[1]}</p>
    <h2>해결 방법</h2>
    <p>${body.split("\n\n")[2]}</p>
    <h2>작업 과정 (스토리형)</h2>
    <p>${body.split("\n\n")[3]}</p>
    <h2>재발 방지 방법</h2>
    <p>${body.split("\n\n")[4]}</p>
  </div>
  <a class="cta" href="tel:${phone.replaceAll("-", "")}">전화 상담 ${phone}</a>
  ${faq}
  <div class="card links">
    <h2>내부 링크</h2>
    <a href="/seo/">지역+서비스 전체 페이지 보기</a>
    <a href="/blog/">배관 관리 블로그 보기</a>
    <a href="/">메인 랜딩으로 이동</a>
  </div>
</body>
</html>`;
}

function renderSeoHub(linksHtml) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>지역+서비스 SEO 페이지 모음</title><meta name="description" content="제우스설비 지역+서비스 페이지 모음"><style>body{font-family:'Noto Sans KR',Arial,sans-serif;max-width:960px;margin:0 auto;padding:24px}a{display:block;margin:6px 0;color:#0369a1}</style></head><body><h1>지역 + 서비스 SEO 페이지</h1><p>자동 생성된 지역/서비스 페이지 모음입니다.</p>${linksHtml}<p><a href="/">메인으로</a></p></body></html>`;
}

function renderBlogIndex(postsHtml) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>배관 관리 블로그</title><meta name="description" content="하수구, 변기, 싱크대, 고압세척, 역류 관련 정보 블로그"><style>body{font-family:'Noto Sans KR',Arial,sans-serif;max-width:960px;margin:0 auto;padding:24px}a{color:#0369a1}article{border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:10px 0}</style></head><body><h1>배관 관리 블로그</h1>${postsHtml}<p><a href="/">메인으로</a></p></body></html>`;
}

function renderBlogPost(title, content, canonical) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="${title} 실전 가이드"><link rel="canonical" href="${canonical}"></head><body style="font-family:'Noto Sans KR',Arial,sans-serif;max-width:860px;margin:0 auto;padding:24px;line-height:1.8"><h1>${title}</h1><p>${content}</p><p><a href="/blog/">블로그 목록</a> | <a href="/">메인</a></p></body></html>`;
}

ensureDir(path.join(docsDir, "seo"));
ensureDir(path.join(docsDir, "blog"));

const sitemapUrls = ["/", "/seo/", "/blog/"];
const seoLinks = [];
let pageCount = 0;

Object.entries(regions).forEach(([citySlug, cityValue]) => {
  Object.entries(cityValue.districts).forEach(([districtSlug, districtValue]) => {
    keywords.services.forEach((service) => {
      const targetDir = path.join(docsDir, "seo", citySlug, districtSlug, service.slug);
      ensureDir(targetDir);
      const html = renderPage({
        citySlug,
        districtSlug,
        serviceSlug: service.slug,
        cityLabel: cityValue.label,
        districtLabel: districtValue.label,
        serviceLabel: service.label
      });
      fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf8");
      const href = `/seo/${citySlug}/${districtSlug}/${service.slug}/`;
      const label = `${cityValue.label} ${districtValue.label} ${service.label}`;
      seoLinks.push(`<a href="${href}">${label}</a>`);
      sitemapUrls.push(href);
      pageCount += 1;
    });
  });
});

fs.writeFileSync(path.join(docsDir, "seo", "index.html"), renderSeoHub(seoLinks.join("")), "utf8");

const topics = [
  "하수구 막히는 이유 5가지",
  "변기 막힘 해결법",
  "고압세척 비용",
  "하수구 역류 원인",
  "싱크대 막힘 예방법",
  "배관 악취 제거 방법",
  "주방 배수관 관리법",
  "상가 배관 점검 체크리스트",
  "아파트 공용 배관 문제 대응",
  "야간 긴급 출동 준비사항"
];

const blogCards = [];
for (let i = 1; i <= 50; i += 1) {
  const topic = topics[(i - 1) % topics.length];
  const title = `${topic} (${i})`;
  const slug = `plumbing-guide-${i}`;
  const canonical = `${siteUrl}/blog/${slug}/`;
  const content = `${title}은 원인 파악, 즉시 조치, 재발 방지의 3단계를 기준으로 접근해야 합니다. 먼저 막힘 위치를 확인하고 증상 빈도를 기록하면 진단 정확도가 높아집니다. 그다음 임시 조치보다 배관 단면 복원과 오염층 제거를 우선해야 재발률을 낮출 수 있습니다. 마지막으로 월 단위 점검 루틴을 운영하면 긴급 출동 발생 빈도를 줄이고 비용 예측을 안정화할 수 있습니다.`;
  const postDir = path.join(docsDir, "blog", slug);
  ensureDir(postDir);
  fs.writeFileSync(path.join(postDir, "index.html"), renderBlogPost(title, content, canonical), "utf8");
  blogCards.push(`<article><h2><a href="/blog/${slug}/">${title}</a></h2><p>${content.slice(0, 90)}...</p></article>`);
  sitemapUrls.push(`/blog/${slug}/`);
}

fs.writeFileSync(path.join(docsDir, "blog", "index.html"), renderBlogIndex(blogCards.join("")), "utf8");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`).join("\n")}
</urlset>`;
fs.writeFileSync(path.join(docsDir, "sitemap.xml"), sitemapXml, "utf8");

console.log(`SEO pages generated: ${pageCount}`);
console.log("Blog pages generated: 50");
console.log("Generated files: docs/seo, docs/blog, docs/sitemap.xml");
