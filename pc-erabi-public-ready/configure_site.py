from pathlib import Path
import sys

root = Path(__file__).parent
domain = input("公開URLを入力（例：https://example.com または https://name.github.io/repo）: ").strip().rstrip("/")
email = input("公開用お問い合わせメールアドレス: ").strip()

if not domain.startswith("http"):
    raise SystemExit("URLは https:// から入力してください。")
if "@" not in email:
    raise SystemExit("メールアドレスを確認してください。")

text_ext = {".html",".xml",".txt",".js",".css",".md"}
for p in root.rglob("*"):
    if p.is_file() and (p.suffix in text_ext or p.name == "robots.txt"):
        s = p.read_text(encoding="utf-8")
        s = s.replace("https://YOUR-DOMAIN.example", domain)
        s = s.replace("CONTACT_EMAIL", email)
        p.write_text(s, encoding="utf-8")
print("設定を反映しました。公開前にREADME.mdのチェックリストも確認してください。")
