#!/usr/bin/env python3
"""Subsets rsms Inter (variable) into the unicode-range files of src/fonts/.

The Google Fonts / Fontsource builds of Inter drop the "ss01" and "cv01"
OpenType features that SnowUI's `--font-sans--font-feature-settings` turns
on, so the package ships subsets of the upstream Inter build instead
(SIL Open Font License 1.1, no Reserved Font Name: src/fonts/LICENSE.txt).

Every subset keeps all layout features and the weight axis (wght 100-900).
The optical-size axis (opsz 14-32) is pinned at 14, Inter's default and the
text optical size: the Figma kit uses the "Inter" family (not "Inter
Display") at every size and the base layer sets `font-optical-sizing: none`,
so browsers never leave opsz 14 and the glyphs are the same, while the files
lose the axis' variation data. The ranges are Google Fonts' (latin, latin-ext, cyrillic…),
"ui-symbols" (the arrows and keyboard symbols that components and shortcut
hints render: ↗ ↩ ⌘ ⌥ ⇧…, a few kB) and "symbols": everything else Inter
covers (maths, box drawing, shapes, private-use icons…), which is large, so
no page downloads it for a single arrow.

The upright faces go to src/fonts.css. The design only uses upright Regular
and Semibold, so the italic faces are opt-in, in src/fonts-italic.css (for
apps with italic text, which otherwise gets the browser's synthesized
oblique).

Only needed when upgrading Inter or changing the ranges; the output is
committed. Run from packages/ui, with the two woff2 files of an Inter release
(https://github.com/rsms/inter/releases, `web/InterVariable*.woff2`, or
https://rsms.me/inter/font-files/):

    python3 -m venv .venv && .venv/bin/pip install fonttools brotli
    .venv/bin/python scripts/subset-inter.py <dir with InterVariable*.woff2>

and `bunx biome format --write src/fonts.css src/fonts-italic.css`. For a new
Inter version, update VERSION and the checksums below first. The output is
deterministic.
"""

import hashlib
import sys
from io import BytesIO
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

VERSION = "4.1"
SOURCES = {
    "normal": (
        "InterVariable.woff2",
        "693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3",
    ),
    "italic": (
        "InterVariable-Italic.woff2",
        "e564f652916db6c139570fefb9524a77c4d48f30c92928de9db19b6b5c7a262a",
    ),
}

# Google Fonts' unicode ranges for Inter, in their @font-face order: where
# ranges overlap (U+0304, U+0308…), the face declared last wins.
RANGES = {
    "cyrillic-ext": "U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F",
    "cyrillic": "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
    "greek-ext": "U+1F00-1FFF",
    "greek": "U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF",
    "vietnamese": "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB",
    "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
    "latin": "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
}

# The optical size every subset is pinned at (see the docstring).
OPSZ = 14

# Arrows (Link's external ↗, CommandPalette's ↩), the keyboard symbols of
# shortcut hints (⌃ ⌘ ⌥ ⌦ ⌫ ⎋ ⏎ ␣) and check marks. Minus what the ranges
# above already cover (↑ ↓ are in latin).
UI_SYMBOLS = "U+2190-21FF,U+2303-2327,U+232B,U+238B,U+23CE-23CF,U+2423,U+2713,U+2717"


def parse(ranges: str) -> set[int]:
    codepoints: set[int] = set()
    for part in ranges.split(","):
        start, _, end = part.removeprefix("U+").partition("-")
        codepoints.update(range(int(start, 16), int(end or start, 16) + 1))
    return codepoints


def format_ranges(codepoints: set[int]) -> str:
    parts, ordered = [], sorted(codepoints)
    start = prev = ordered[0]
    for cp in [*ordered[1:], None]:
        if cp is not None and cp == prev + 1:
            prev = cp
            continue
        parts.append(f"U+{start:04X}" if start == prev else f"U+{start:04X}-{prev:04X}")
        if cp is not None:
            start = prev = cp
    return ", ".join(parts)


def pin_optical_size(path: Path) -> bytes:
    """The font with its opsz axis pinned at OPSZ (wght stays variable), as TTF."""
    font = TTFont(path, recalcTimestamp=False)
    instancer.instantiateVariableFont(font, {"opsz": OPSZ}, inplace=True)
    font.flavor = None
    buffer = BytesIO()
    font.save(buffer)
    return buffer.getvalue()


def header(title: str, usage: str) -> list[str]:
    return [
        "/*",
        f" * {title}",
        " *",
        f" * Inter {VERSION} (https://rsms.me/inter) by Rasmus Andersson: the variable",
        " * font (wght 100-900; opsz pinned at 14, the text optical size) with every",
        ' * OpenType feature, including the "ss01" / "cv01" alternates SnowUI turns',
        " * on. SIL Open Font License 1.1: fonts/LICENSE.txt. Split by unicode-range,",
        " * so browsers only download the scripts a page uses.",
        " *",
        f" * Generated by scripts/subset-inter.py. {usage}",
        " */",
    ]


def main(source_dir: Path) -> None:
    out = Path("src/fonts")
    out.mkdir(parents=True, exist_ok=True)
    faces: dict[str, list[tuple[str, str, str]]] = {}
    for style, (filename, checksum) in SOURCES.items():
        path = source_dir / filename
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != checksum:
            sys.exit(f"{path}: sha256 {digest}, expected {checksum} (Inter {VERSION})")
        covered = set(TTFont(path).getBestCmap())
        pinned = pin_optical_size(path)
        known = set().union(*(parse(r) for r in RANGES.values()))
        ui_symbols = parse(UI_SYMBOLS) - known
        # "ui-symbols" is declared after "symbols"; they don't overlap.
        subsets = {
            "symbols": covered - known - ui_symbols,
            "ui-symbols": ui_symbols,
            **{k: parse(v) for k, v in RANGES.items()},
        }
        for name, codepoints in subsets.items():
            codepoints &= covered
            if not codepoints:
                continue
            options = subset.Options()
            options.layout_features = ["*"]
            options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
            font = TTFont(BytesIO(pinned), recalcTimestamp=False)
            subsetter = subset.Subsetter(options)
            subsetter.populate(unicodes=codepoints)
            subsetter.subset(font)
            font.flavor = "woff2"
            target = out / f"inter-{name}-{style}.woff2"
            font.save(target)
            print(f"{target}: {len(codepoints)} characters, {target.stat().st_size // 1024} KB")
            faces.setdefault(style, []).append((target.name, name, format_ranges(codepoints)))

    files = {
        "normal": (
            "src/fonts.css",
            header(
                "Inter, upright (`@holakirr/snow-ui/fonts.css`).",
                "Opt-in: import it once, from JavaScript.",
            ),
        ),
        "italic": (
            "src/fonts-italic.css",
            header(
                "Inter, italic (`@holakirr/snow-ui/fonts-italic.css`).",
                "Opt-in, next to fonts.css: the design has no italic styles.",
            ),
        ),
    }
    for style, (target, css) in files.items():
        for filename, name, ranges in faces[style]:
            css += [
                "",
                f"/* {name} */",
                "@font-face {",
                '  font-family: "Inter";',
                f"  font-style: {style};",
                "  font-weight: 100 900;",
                "  font-display: swap;",
                f'  src: url("./fonts/{filename}") format("woff2");',
                f"  unicode-range: {ranges};",
                "}",
            ]
        Path(target).write_text("\n".join(css) + "\n")
        print(target)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
