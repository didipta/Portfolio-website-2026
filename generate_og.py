# pyright: reportMissingImports=false
# -*- coding: utf-8 -*-
"""
=============================================================================
Dipta Saha — High-End Editorial Open Graph & Social Card Generator
Generates: og-image.jpg, og-image.png, and og-preview.jpg
Standard Resolution: 1200 x 630 pixels (1.91:1 aspect ratio)

Design Principles:
- NO BOXES / NO CARDS / NO PILLS / NO ARTIFICIAL FRAMES
- Clean, open, premium editorial design
- Seamless photo blend: Dipta's authentic photo smoothly transitions into
  the dark canvas with a soft linear alpha gradient.
- High-contrast, beautifully balanced typography with generous breathing room.
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
        return ImageFont.load_default(size=size)  # type: ignore
    except TypeError:
        return ImageFont.load_default()


def create_og_image():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    W, H = 1200, 630

    print("[*] Generating clean editorial social cards (1200x630, zero boxes)...")

    # 1. Base Canvas — Deep Rich Obsidian Slate (#060913)
    canvas = Image.new("RGBA", (W, H), (6, 9, 19, 255))

    # 2. Subtle Diffused Ambient Glows (soft lighting aura for cinematic depth)
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)

    # Soft cyan aura on upper left
    glow_draw.ellipse([(-120, -100), (450, 420)], fill=(6, 182, 212, 40))
    # Deep indigo aura behind typography
    glow_draw.ellipse([(100, 160), (600, 620)], fill=(99, 102, 241, 30))
    # Warm amber accent at the top right to harmonize with cafe lights
    glow_draw.ellipse([(850, -100), (1250, 300)], fill=(245, 158, 11, 25))

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=90))
    canvas = Image.alpha_composite(canvas, glow_layer)

    # 3. Portrait Integration — Seamless Fade into Background (NO BOX, NO FRAME)
    photo_path = os.path.join(base_dir, "dipta-saha.jpg")
    if os.path.exists(photo_path):
        print(f"[*] Processing portrait photo: {photo_path}")
        raw_portrait = Image.open(photo_path).convert("RGBA")
        src_w, src_h = raw_portrait.size  # 819 x 1024

        # Crop from y=120 to bottom to include pendant lights, face, laptop, hands, and table
        crop_top = 120
        crop_bottom = src_h
        crop_h = crop_bottom - crop_top
        crop_w = src_w
        cropped = raw_portrait.crop((0, crop_top, crop_w, crop_bottom))

        # Target dimensions on canvas: full canvas height (630px)
        target_h = H
        scale = target_h / float(crop_h)
        target_w = int(crop_w * scale)  # ~ 571 px
        portrait_resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Smooth horizontal alpha gradient mask (left-to-right fade)
        # The left 220px of the photo gently transitions from 0 (transparent) to 255 (solid)
        mask = Image.new("L", (target_w, target_h), 255)
        fade_width = 220
        for x in range(fade_width):
            # Smooth ease-in-out curve
            t = x / float(fade_width)
            # Cubic ease-in-out: 3*t^2 - 2*t^3
            factor = (3 * (t ** 2)) - (2 * (t ** 3))
            alpha_val = int(255 * factor)
            for y in range(target_h):
                mask.putpixel((x, y), alpha_val)

        # Paste portrait flush to the right edge (x = 1200 - target_w = ~629 to 1200)
        paste_x = W - target_w
        canvas.paste(portrait_resized, (paste_x, 0), mask)
        print(f"[+] Seamless portrait blended at x={paste_x} to x={W}")
    else:
        print(f"[!] Warning: '{photo_path}' not found, skipping portrait.")

    # 4. Editorial Typography Layer (Clean, crisp, elegant, zero boxes)
    draw = ImageDraw.Draw(canvas)

    # Font Discovery
    font_candidates_bold = [
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "/System/Library/Fonts/SFProDisplay-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    font_candidates_regular = [
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "/System/Library/Fonts/SFProDisplay-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    font_candidates_semibold = [
        "C:\\Windows\\Fonts\\seguisb.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf",
    ]

    f_bold = next((f for f in font_candidates_bold if os.path.exists(f)), None)
    f_reg = next((f for f in font_candidates_regular if os.path.exists(f)), None)
    f_semi = next((f for f in font_candidates_semibold if os.path.exists(f)), None)

    font_kicker = get_font(f_semi or f_bold, 13)
    font_name = get_font(f_bold, 62)
    font_role = get_font(f_semi or f_bold, 28)
    font_pillars = get_font(f_semi or f_reg, 19)
    font_bio = get_font(f_reg, 17)
    font_stats = get_font(f_semi or f_reg, 15)
    font_tech_label = get_font(f_semi or f_bold, 12)
    font_tech = get_font(f_reg, 15)
    font_url = get_font(f_semi or f_reg, 15)

    # Left Margin (65px) — Keeps all text safely away from the photo laptop (which starts past x=640)
    lx = 65

    # A. Minimalist Kicker Accent Line (NO BOX, clean cyan dot + tracked text)
    draw.ellipse([(lx, 75), (lx + 8, 83)], fill=(6, 182, 212))
    draw.text((lx + 16, 70), "SOFTWARE ENGINEER   ·   PORTFOLIO", fill="#38BDF8", font=font_kicker)

    # B. Hero Name — Large, crisp, striking
    # Soft text shadow for crisp legibility
    draw.text((lx + 2, 114), "Dipta Saha", fill=(0, 0, 0, 180), font=font_name)
    draw.text((lx, 112), "Dipta Saha", fill="#FFFFFF", font=font_name)

    # C. Primary Role
    draw.text((lx, 196), "Software Engineer", fill="#38BDF8", font=font_role)

    # D. Key Technical Focus Line
    draw.text((lx, 238), "Flutter Mobile   ·   Full-Stack Web   ·   Computer Vision AI", fill="#C084FC", font=font_pillars)

    # E. Refined Editorial Bio Statement (2 lines, pure clean text)
    draw.text((lx, 286), "Engineering high-performance cross-platform mobile apps, scalable", fill="#94A3B8", font=font_bio)
    draw.text((lx, 312), "cloud platforms, and real-time computer vision AI systems.", fill="#94A3B8", font=font_bio)

    # F. Core Tech Stack (Compact, elegant 2-line layout, NO CARDS, NO BOXES)
    draw.text((lx, 368), "CORE TECHNOLOGIES", fill="#64748B", font=font_tech_label)
    draw.text((lx, 390), "Flutter  •  Dart  •  Next.js  •  Python  •  FastAPI", fill="#E2E8F0", font=font_tech)
    draw.text((lx, 414), "Django  •  Docker  •  PostgreSQL  •  YOLO AI", fill="#CBD5E1", font=font_tech)

    # G. Key Metrics Line (Clean typography, NO BOXES)
    draw.text((lx, 458), "4+ Years Experience    •    14+ Production Projects", fill="#38BDF8", font=font_stats)

    # H. Subtle Clean Separator (thin hairline, low opacity)
    draw.line([(lx, 510), (lx + 530, 510)], fill=(255, 255, 255, 25), width=1)

    # I. Bottom Domain Link
    draw.text((lx, 532), "dipta-saha.vercel.app", fill="#F8FAFC", font=font_url)
    draw.text((lx + 205, 532), "•   github.com/didipta   •   Dhaka, Bangladesh", fill="#64748B", font=font_stats)

    # 5. Export to JPG and PNG
    out_png = os.path.join(base_dir, "og-image.png")
    out_jpg = os.path.join(base_dir, "og-image.jpg")
    out_preview = os.path.join(base_dir, "og-preview.jpg")

    final_rgb = canvas.convert("RGB")
    final_rgb.save(out_jpg, "JPEG", quality=96, optimize=True)
    final_rgb.save(out_preview, "JPEG", quality=96, optimize=True)
    canvas.save(out_png, "PNG", optimize=True)

    print("\n[+] Clean, box-free images generated successfully:")
    print(f"    - og-image.jpg:   {os.path.getsize(out_jpg)} bytes")
    print(f"    - og-image.png:   {os.path.getsize(out_png)} bytes")
    print(f"    - og-preview.jpg: {os.path.getsize(out_preview)} bytes")


if __name__ == "__main__":
    create_og_image()
