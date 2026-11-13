"""Re-colour any page or component that still uses the old maroon palette (safe to run more than once).

Run from the frontend folder:   python tools\\apply_theme.py
It rewrites .tsx files under app\\ and components\\ and prints every file it changed. Commit first, so
`git diff` shows exactly what moved and `git checkout -- .` undoes it.
"""
import re
import sys
from pathlib import Path

MAP = {
    "#831843": "#0060AA", "#701237": "#004D8A", "#6b1337": "#004D8A", "#FAF8F5": "#F4F8FC",
    "#E5DFD5": "#D5E1EE", "#EAE4D9": "#DCE7F2", "#DDD8CE": "#C8D7E8", "#E8E2D8": "#D9E4F0",
    "#DCD6CC": "#CBD9E9", "#DDD": "#C8D7E8", "#F4F0E8": "#EAF1F8", "#F1ECE3": "#E8F0F8",
    "#F1EBE2": "#E6EEF7", "#EFEBE4": "#E8EFF7", "#64748B": "#5B6B80",
}


def convert(text: str) -> str:
    for old, new in MAP.items():
        text = re.sub(re.escape(old) + r"(?![0-9A-Fa-f])", new, text, flags=re.I)
    return text.replace("font-serif", "font-heading")


def main() -> None:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    changed = 0
    for folder in ("app", "components"):
        for f in sorted((root / folder).rglob("*.tsx")):
            old = f.read_text(encoding="utf-8")
            new = convert(old)
            if new != old:
                f.write_text(new, encoding="utf-8", newline="")
                changed += 1
                print("updated", f.relative_to(root))
    print(f"Done. {changed} file(s) changed.")


if __name__ == "__main__":
    main()
