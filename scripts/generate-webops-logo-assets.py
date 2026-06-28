#!/usr/bin/env python3
"""Generate favicons and social profile assets from master logo files."""
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parents[1] / "assets" / "images" / "logo"


def crop_content_box(im: Image.Image) -> Image.Image:
    """Crop to logo content (non-flat background)."""
    arr = np.array(im.convert("RGB"))
    # Pixels that differ from image median (background) — works for logo on solid bg
    med = np.median(arr.reshape(-1, 3), axis=0)
    diff = np.abs(arr.astype(np.float32) - med).sum(axis=2)
    mask = diff > 25
    if not mask.any():
        return im
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    pad = 8
    y0, y1 = max(rows[0] - pad, 0), min(rows[-1] + pad, arr.shape[0])
    x0, x1 = max(cols[0] - pad, 0), min(cols[-1] + pad, arr.shape[1])
    return im.crop((x0, y0, x1, y1))


def paste_center(canvas: Image.Image, logo: Image.Image, scale: float = 0.72) -> None:
    lw, lh = logo.size
    cw, ch = canvas.size
    target_w = int(cw * scale)
    target_h = int(lh * (target_w / lw))
    if target_h > int(ch * scale):
        target_h = int(ch * scale)
        target_w = int(lw * (target_h / lh))
    logo_r = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    x = (cw - target_w) // 2
    y = (ch - target_h) // 2
    if logo_r.mode == "RGBA":
        canvas.paste(logo_r, (x, y), logo_r)
    else:
        canvas.paste(logo_r, (x, y))


def _load_font_pair(size_bold: int, size_reg: int):
    """Bold + regular from the same family when possible (macOS / Linux)."""
    bold_candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    reg_candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    fb, fr = None, None
    for p in bold_candidates:
        if os.path.isfile(p):
            try:
                fb = ImageFont.truetype(p, size_bold)
                break
            except OSError:
                continue
    for p in reg_candidates:
        if os.path.isfile(p):
            try:
                fr = ImageFont.truetype(p, size_reg)
                break
            except OSError:
                continue
    if fb is None or fr is None:
        fb = fr = ImageFont.load_default()
    return fb, fr


def _text_width(draw: ImageDraw.ImageDraw, text: str, font) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def _union_bbox(boxes):
    l = min(b[0] for b in boxes)
    t = min(b[1] for b in boxes)
    r = max(b[2] for b in boxes)
    b = max(b[3] for b in boxes)
    return (l, t, r, b)


def generate_text_only_wordmarks() -> None:
    """Transparent PNGs: 'WebOps' bold + ' Development' regular — white and black.

    Uses per-segment textbbox (not image getbbox) so anti-aliased edges are not clipped.
    """
    pad = 64
    size_bold, size_reg = 168, 158
    fb, fr = _load_font_pair(size_bold, size_reg)

    def render(fill: tuple[int, int, int]) -> Image.Image:
        canvas_w, canvas_h = 4200, 900
        img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        baseline_y = canvas_h // 2
        x = 600
        rgba = fill + (255,)

        # Draw and collect ink bboxes (includes glyph anti-aliasing)
        segments = [("WebOps", fb), (" Development", fr)]
        boxes: list[tuple[int, int, int, int]] = []
        for text, font in segments:
            draw.text((x, baseline_y), text, font=font, fill=rgba, anchor="ls")
            boxes.append(draw.textbbox((x, baseline_y), text, font=font, anchor="ls"))
            x += _text_width(draw, text, font)

        ink = _union_bbox(boxes)
        l, t, r, b = ink
        l = max(0, l - pad)
        t = max(0, t - pad)
        r = min(canvas_w, r + pad)
        b = min(canvas_h, b + pad)
        return img.crop((l, t, r, b))

    white_txt = render((255, 255, 255))
    black_txt = render((17, 24, 39))  # gray-900 on light backgrounds

    white_txt.save(BASE / "webops-wordmark-text-white.png", optimize=True)
    black_txt.save(BASE / "webops-wordmark-text-black.png", optimize=True)


# Brand palette (matches site CSS / SVG brandmark)
_BRAND_BLUE = (37, 99, 235)  # #2563eb
_BRAND_TEAL = (20, 184, 166)  # #14b8a6
_BRAND_AMBER = (245, 158, 11)  # #f59e0b


def _load_regular_at(size: int):
    reg_candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in reg_candidates:
        if os.path.isfile(p):
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    return ImageFont.load_default()


def generate_llc_brand_wordmark() -> None:
    """Full legal name on transparent background — WebOps (blue) + Development (teal) + LLC (amber)."""
    pad = 64
    size_bold, size_reg = 168, 158
    size_llc = 140
    fb, fr = _load_font_pair(size_bold, size_reg)
    f_llc = _load_regular_at(size_llc)

    canvas_w, canvas_h = 4800, 900
    img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    baseline_y = canvas_h // 2
    x = 500

    segments = [
        ("WebOps", fb, _BRAND_BLUE),
        (" Development", fr, _BRAND_TEAL),
        (" LLC", f_llc, _BRAND_AMBER),
    ]
    boxes = []
    for text, font, rgb in segments:
        rgba = rgb + (255,)
        draw.text((x, baseline_y), text, font=font, fill=rgba, anchor="ls")
        boxes.append(draw.textbbox((x, baseline_y), text, font=font, anchor="ls"))
        x += _text_width(draw, text, font)

    ink = _union_bbox(boxes)
    l, t, r, b = ink
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(canvas_w, r + pad)
    b = min(canvas_h, b + pad)
    out = img.crop((l, t, r, b))
    out.save(BASE / "webops-wordmark-llc-brand-colors.png", optimize=True)


def generate_llc_brand_wordmark_black_bg() -> None:
    """Same LLC + brand colors on solid black — tight crop + 1080 square for social."""
    pad = 64
    size_bold, size_reg = 168, 158
    size_llc = 140
    fb, fr = _load_font_pair(size_bold, size_reg)
    f_llc = _load_regular_at(size_llc)

    canvas_w, canvas_h = 4800, 900
    img = Image.new("RGB", (canvas_w, canvas_h), (0, 0, 0))
    draw = ImageDraw.Draw(img)
    baseline_y = canvas_h // 2
    x = 500

    segments = [
        ("WebOps", fb, _BRAND_BLUE),
        (" Development", fr, _BRAND_TEAL),
        (" LLC", f_llc, _BRAND_AMBER),
    ]
    boxes = []
    for text, font, rgb in segments:
        draw.text((x, baseline_y), text, font=font, fill=rgb, anchor="ls")
        boxes.append(draw.textbbox((x, baseline_y), text, font=font, anchor="ls"))
        x += _text_width(draw, text, font)

    ink = _union_bbox(boxes)
    l, t, r, b = ink
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(canvas_w, r + pad)
    b = min(canvas_h, b + pad)
    tight = img.crop((l, t, r, b))
    tight.save(BASE / "webops-wordmark-llc-brand-colors-black-bg.png", optimize=True)

    # 1080×1080 for profile / posts
    sq = 1080
    margin = 72
    canvas = Image.new("RGB", (sq, sq), (0, 0, 0))
    w, h = tight.size
    max_w = sq - 2 * margin
    max_h = sq - 2 * margin
    scale = min(max_w / w, max_h / h)
    nw = max(1, int(w * scale))
    nh = max(1, int(h * scale))
    resized = tight.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((sq - nw) // 2, (sq - nh) // 2))
    canvas.save(BASE / "webops-wordmark-llc-brand-colors-black-bg-1080.png", optimize=True)


def main() -> None:
    black_full = Image.open(BASE / "webops-logo-A-clean-black.png").convert("RGBA")
    white_full = Image.open(BASE / "webops-logo-A-clean-white.png").convert("RGBA")
    transparent = Image.open(BASE / "webops-logo-A-clean-transparent.png").convert("RGBA")

    # --- Favicons: dark logo on white square (readable in browser tabs) ---
    logo_white_bg = crop_content_box(white_full)
    side = max(logo_white_bg.size)
    pad = int(side * 0.12)
    fav_square = Image.new("RGB", (side + pad * 2, side + pad * 2), (255, 255, 255))
    lr = logo_white_bg.resize(
        (side, int(logo_white_bg.size[1] * (side / logo_white_bg.size[0]))),
        Image.Resampling.LANCZOS,
    )
    x = (fav_square.size[0] - lr.size[0]) // 2
    y = (fav_square.size[1] - lr.size[1]) // 2
    if lr.mode == "RGBA":
        fav_square.paste(lr, (x, y), lr)
    else:
        fav_square.paste(lr, (x, y))

    fav32 = fav_square.resize((32, 32), Image.Resampling.LANCZOS)
    fav180 = fav_square.resize((180, 180), Image.Resampling.LANCZOS)
    fav32.save(BASE / "favicon-32.png", optimize=True)
    fav180.save(BASE / "favicon-180.png", optimize=True)

    # --- Social: 1080 square profiles ---
    sq = 1080
    # Black background + content from black_full (light logo on black)
    black_bg = Image.new("RGB", (sq, sq), (0, 0, 0))
    logo_on_black = crop_content_box(black_full)
    paste_center(black_bg, logo_on_black, scale=0.78)
    black_bg.save(BASE / "social-profile-black-bg-1080.png", optimize=True)

    # White background + dark logo
    white_bg = Image.new("RGB", (sq, sq), (255, 255, 255))
    logo_on_white = crop_content_box(white_full)
    paste_center(white_bg, logo_on_white, scale=0.78)
    white_bg.save(BASE / "social-profile-white-bg-1080.png", optimize=True)

    # --- Watermark: white logo, bottom-right, for overlay on photos ---
    wm_w, wm_h = 1600, 900
    wm = Image.new("RGBA", (wm_w, wm_h), (0, 0, 0, 0))
    # Use RGB from transparent (logo in light color)
    t_crop = crop_content_box(transparent)
    tw = int(wm_w * 0.22)
    th = int(t_crop.size[1] * (tw / t_crop.size[0]))
    tr = t_crop.resize((tw, th), Image.Resampling.LANCZOS)
    margin = 48
    wm.paste(tr, (wm_w - tw - margin, wm_h - th - margin), tr)
    wm.save(BASE / "social-watermark-light-logo-1600x900.png", optimize=True)

    # --- Text-only wordmark (WebOps Development), transparent background ---
    generate_text_only_wordmarks()

    # --- Full legal name, brand colors (transparent) ---
    generate_llc_brand_wordmark()
    generate_llc_brand_wordmark_black_bg()

    print("Wrote:", BASE / "favicon-32.png")
    print("Wrote:", BASE / "favicon-180.png")
    print("Wrote:", BASE / "social-profile-black-bg-1080.png")
    print("Wrote:", BASE / "social-profile-white-bg-1080.png")
    print("Wrote:", BASE / "social-watermark-light-logo-1600x900.png")
    print("Wrote:", BASE / "webops-wordmark-text-white.png")
    print("Wrote:", BASE / "webops-wordmark-text-black.png")
    print("Wrote:", BASE / "webops-wordmark-llc-brand-colors.png")
    print("Wrote:", BASE / "webops-wordmark-llc-brand-colors-black-bg.png")
    print("Wrote:", BASE / "webops-wordmark-llc-brand-colors-black-bg-1080.png")
    print("Note: Brandmark profile squares (SVG icon): npm run render:brandmark-profiles")


if __name__ == "__main__":
    main()
