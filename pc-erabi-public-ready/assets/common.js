
(() => {
  const notice = document.getElementById("cookieNotice");
  if (!notice) return;
  const key = "pc-erabi-cookie-notice-v1";
  if (!localStorage.getItem(key)) notice.classList.add("show");
  const close = () => { localStorage.setItem(key, "seen"); notice.classList.remove("show"); };
  document.getElementById("cookieAccept")?.addEventListener("click", close);
  document.getElementById("cookieClose")?.addEventListener("click", close);
})();
