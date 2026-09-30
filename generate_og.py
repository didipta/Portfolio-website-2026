# pyright: reportMissingImports=false
# -*- coding: utf-8 -*-
"""
=============================================================================
Dipta Saha — Open Graph & Twitter Social Share Card Generator
Generates: og-image.jpg, og-image.png, and og-preview.jpg
Standard Resolution: 1200 x 630 pixels (1.91:1 aspect ratio)
=============================================================================
"""

import os
import sys
import subprocess

# Ensure Pillow (PIL) is available; auto-install if missing
try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter  # type: ignore
except ImportError:
    print("[*] Pillow is not installed in this environment. Installing automatically...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
        from PIL import Image, ImageDraw, ImageFont, ImageFilter  # type: ignore
        print("[+] Pillow installed successfully!\n")
    except Exception as err:
        print("[!] Could not auto-install Pillow:", err)
        print("[!] Please run manually in your terminal: pip install pillow")
        sys.exit(1)


def get_font(font_path, size):
    """Safely loads a TrueType font or falls back to system default."""
    if font_path and os.path.exists(font_path):
        try:
            return ImageFont.truetype(font_path, size)
        except Exception:
            pass
    try:
        # Pillow 10.1+ supports size in load_default
        return ImageFont.load_default(size=size)  # type: ignore
    except TypeError:
        return ImageFont.load_default()


def create_og_image():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    W, H = 1200, 630

    print(f"[*] Starting Open Graph image generation (Target: {W}x{H})...")

    # 1. Base dark obsidian canvas
    img = Image.new("RGB", (W, H), "#040714")

    # Ambient glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)

    # Cyan glow (top left)
    glow_draw.ellipse((-100, -100, 480, 480), fill=(6, 182, 212, 80))
    # Indigo glow (bottom center/left)
    glow_draw.ellipse((220, 280, 780, 800), fill=(99, 102, 241, 70))
    # Purple glow (behind photo)
    glow_draw.ellipse((720, 60, 1280, 620), fill=(168, 85, 247, 65))

    glow = glow.filter(ImageFilter.GaussianBlur(85))
    img.paste(glow, (0, 0), glow)

    draw = ImageDraw.Draw(img)

    # Ultra-subtle grid
    for x in range(0, W, 48):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 5), width=1)
    for y in range(0, H, 48):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 5), width=1)

    # Sleek Outer border
    draw.rounded_rectangle([(18, 18), (W - 18, H - 18)], radius=24, outline=(99, 102, 241, 150), width=2)
    draw.rounded_rectangle([(21, 21), (W - 21, H - 21)], radius=22, outline=(6, 182, 212, 70), width=1)

    # Cross-platform font discovery
    font_candidates = [
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ]
    bold_font_path = next((f for f in font_candidates if os.path.exists(f) and any(b in f.lower() for b in ["bd", "uib", "bold"])), None)
    regular_font_path = next((f for f in font_candidates if os.path.exists(f) and not any(b in f.lower() for b in ["bd", "uib", "bold"])), None)

    f_brand = get_font(regular_font_path or bold_font_path, 15)
    f_badge = get_font(bold_font_path or regular_font_path, 13)
    f_name = get_font(bold_font_path or regular_font_path, 52)
    f_role = get_font(bold_font_path or regular_font_path, 26)
    f_subrole = get_font(bold_font_path or regular_font_path, 19)
    f_desc = get_font(regular_font_path or bold_font_path, 17)
    f_pill_title = get_font(bold_font_path or regular_font_path, 15)
    f_pill_sub = get_font(regular_font_path or bold_font_path, 13)
    f_meta = get_font(regular_font_path or bold_font_path, 14)

    # 2. Right Side: Dipta Saha Portrait Photo (Focused on Face + Laptop)
    photo_path = os.path.join(base_dir, "dipta-saha.jpg")
    if os.path.exists(photo_path):
        print(f"[*] Processing portrait image: {photo_path}")
        portrait = Image.open(photo_path).convert("RGBA")
        src_w, src_h = portrait.size  # 819 x 1024

        crop_top = 370
        crop_bottom = 990
        crop_h = crop_bottom - crop_top
        pw, ph = 440, 520
        target_ratio = pw / ph

        crop_w = int(crop_h * target_ratio)
        if crop_w > src_w:
            crop_w = src_w
            crop_h = int(crop_w / target_ratio)
            crop_top = max(0, 370 - (crop_h - (990 - 370)) // 2)

        crop_left = (src_w - crop_w) // 2
        portrait = portrait.crop((crop_left, crop_top, crop_left + crop_w, crop_top + crop_h))
        portrait = portrait.resize((pw, ph), Image.Resampling.LANCZOS)

        # Rounded mask
        mask = Image.new("L", (pw, ph), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([(0, 0), (pw, ph)], radius=20, fill=255)

        px, py = 715, 55

        # Glowing Neon Double Border around portrait
        photo_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        pg_draw = ImageDraw.Draw(photo_glow)
        pg_draw.rounded_rectangle([(px - 3, py - 3), (px + pw + 3, py + ph + 3)], radius=23, outline=(6, 182, 212, 230), width=3)
        pg_draw.rounded_rectangle([(px - 6, py - 6), (px + pw + 6, py + ph + 6)], radius=26, outline=(99, 102, 241, 140), width=2)
        img.paste(photo_glow, (0, 0), photo_glow)

        img.paste(portrait, (px, py), mask)

        # Floating Status Badge at bottom of portrait
        badge_w, badge_h = 230, 36
        bx, by = px + (pw - badge_w) // 2, py + ph - 46
        badge_bg = Image.new("RGBA", (badge_w, badge_h), (6, 10, 24, 235))
        b_draw = ImageDraw.Draw(badge_bg)
        b_draw.rounded_rectangle([(0, 0), (badge_w, badge_h)], radius=18, outline=(16, 185, 129, 230), width=1)
        b_draw.ellipse([(14, 13), (24, 23)], fill=(16, 185, 129))
        b_draw.text((32, 9), "Available for Projects", fill="#34D399", font=f_badge)
        img.paste(badge_bg, (bx, by), badge_bg)
    else:
        print(f"[!] Warning: Portrait '{photo_path}' not found. Skipping photo framing.")

    # 3. Left Side Content
    lx = 60

    # Top Brand Header Pill
    draw.rounded_rectangle([(lx, 55), (lx + 38, 93)], radius=10, fill=(15, 23, 42), outline=(6, 182, 212), width=1)
    draw.text((lx + 9, 64), "DS", fill="#38BDF8", font=f_badge)
    draw.text((lx + 50, 65), "Dipta Saha  /  Software Engineering Portfolio", fill="#94A3B8", font=f_brand)

    # Experience Pill
    draw.rounded_rectangle([(lx, 110), (lx + 215, 138)], radius=14, fill=(99, 102, 241, 50), outline=(99, 102, 241, 140), width=1)
    draw.text((lx + 14, 115), "4+ YEARS EXPERIENCE", fill="#A5B4FC", font=f_badge)

    # Main Name
    draw.text((lx, 150), "Dipta Saha", fill="#FFFFFF", font=f_name)

    # Primary Title
    draw.text((lx, 216), "Software Engineer", fill="#38BDF8", font=f_role)

    # Tech Pillars summary
    draw.text((lx, 252), "Flutter Mobile   |   Full-Stack Web   |   Python AI", fill="#C084FC", font=f_subrole)

    # Bio Subtitle
    draw.text((lx, 288), "Engineering production mobile applications, scalable cloud backends,", fill="#94A3B8", font=f_desc)
    draw.text((lx, 312), "and real-time computer vision AI systems deployed at scale.", fill="#94A3B8", font=f_desc)

    # 3 Pillar Feature Cards
    cards = [
        ("Flutter Mobile Architecture", "App Store & Google Play • Firebase • Offline Sync", (56, 189, 248)),
        ("Full-Stack Web Platforms", "Next.js 14 • Node.js • ASP.NET • High-Traffic APIs", (129, 140, 248)),
        ("Python & Applied AI Systems", "YOLO Computer Vision • FastAPI • Docker Pipelines", (192, 132, 252))
    ]

    cy = 352
    for title, subtitle, color in cards:
        draw.rounded_rectangle([(lx, cy), (lx + 580, cy + 48)], radius=10, fill=(13, 19, 38, 220), outline=color, width=1)
        draw.ellipse([(lx + 14, cy + 20), (lx + 22, cy + 28)], fill=color)
        draw.text((lx + 32, cy + 7), title, fill="#FFFFFF", font=f_pill_title)
        draw.text((lx + 32, cy + 27), subtitle, fill="#94A3B8", font=f_pill_sub)
        cy += 56

    # Bottom Contact Bar
    draw.line([(lx, 536), (lx + 580, 536)], fill=(255, 255, 255, 30), width=1)
    draw.text((lx, 548), "Dhaka, Bangladesh   •   github.com/didipta   •   sdipta707@gmail.com", fill="#64748B", font=f_meta)

    # Export paths
    out_png = os.path.join(base_dir, "og-image.png")
    out_jpg = os.path.join(base_dir, "og-image.jpg")
    out_preview = os.path.join(base_dir, "og-preview.jpg")

    img.save(out_png, "PNG", optimize=True)
    img.save(out_jpg, "JPEG", quality=95, optimize=True)
    img.save(out_preview, "JPEG", quality=95, optimize=True)

    print("\n[+] Success! The following social cards were generated at 1200x630:")
    print(f"    - {out_jpg} ({os.path.getsize(out_jpg)} bytes)")
    print(f"    - {out_png} ({os.path.getsize(out_png)} bytes)")


if __name__ == "__main__":
    create_og_image()
