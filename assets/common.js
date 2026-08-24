
(() => {
  const measurementId = "G-0V7RWHJ1FT";
  const notice = document.getElementById("cookieNotice");
  const key = "pc-erabi-analytics-consent";

  const loadAnalytics = () => {
    if (window.googleAnalyticsLoaded) return;
    window.googleAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(tag);
  };

  const showNotice = () => notice?.classList.add("show");
  const decide = (choice) => {
    try { localStorage.setItem(key, choice); } catch (_) { /* 保存できない場合も選択は反映 */ }
    notice?.classList.remove("show");
    if (choice === "granted") loadAnalytics();
  };

  let consent = null;
  try { consent = localStorage.getItem(key); } catch (_) { /* 読み取れない場合は確認を表示 */ }
  if (consent === "granted") loadAnalytics();
  else if (consent !== "denied") showNotice();

  if (notice) {
    const privacyUrl = location.pathname.includes("/articles/") ? "../privacy.html" : "privacy.html";
    const message = notice.querySelector("p");
    if (message) message.innerHTML = `サイト改善のためGoogle Analyticsを使用します。同意するとCookieなどを利用して匿名の利用状況を収集します。詳しくは<a href="${privacyUrl}" style="color:#fff;text-decoration:underline">プライバシーポリシー</a>をご確認ください。`;
    const accept = document.getElementById("cookieAccept");
    const deny = document.getElementById("cookieClose");
    if (accept) accept.textContent = "同意する";
    if (deny) deny.textContent = "同意しない";
    accept?.addEventListener("click", () => decide("granted"));
    deny?.addEventListener("click", () => decide("denied"));
  }

  document.querySelector("[data-analytics-consent-reset]")?.addEventListener("click", () => {
    try { localStorage.removeItem(key); } catch (_) { /* 保存領域が使えなくても再表示 */ }
    showNotice();
  });
})();
