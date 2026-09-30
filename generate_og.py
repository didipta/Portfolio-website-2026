import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_og_image():
    W, H = 1200, 630
    
    # 1. Base dark obsidian canvas
    img = Image.new("RGB", (W, H), "#040714")
    
    # Ambient glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Cyan glow (top left)
    glow_draw.ellipse((-100, -100, 450, 450), fill=(6, 182, 212, 75))
    # Indigo glow (bottom center/left)
    glow_draw.ellipse((200, 300, 750, 800), fill=(99, 102, 241, 65))
    # Purple/Violet glow (behind portrait)
    glow_draw.ellipse((700, 80, 1250, 600), fill=(168, 85, 247, 55))
    
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    img.paste(glow, (0, 0), glow)

    draw = ImageDraw.Draw(img)

    # Very subtle, elegant background grid
    for x in range(0, W, 48):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 4), width=1)
    for y in range(0, H, 48):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 4), width=1)

    # Sleek Outer border
    draw.rounded_rectangle([(20, 20), (W - 20, H - 20)], radius=24, outline=(99, 102, 241, 140), width=2)
    # Inner subtle glow outline
    draw.rounded_rectangle([(23, 23), (W - 23, H - 23)], radius=22, outline=(6, 182, 212, 60), width=1)

    # Fonts
    font_dir = "C:/Windows/Fonts"
    f_brand = ImageFont.truetype(f"{font_dir}/segoeui.ttf", 15)
    f_badge = ImageFont.truetype(f"{font_dir}/segoeuib.ttf", 13)
    f_name = ImageFont.truetype(f"{font_dir}/segoeuib.ttf", 52)
    f_role = ImageFont.truetype(f"{font_dir}/segoeuib.ttf", 26)
    f_subrole = ImageFont.truetype(f"{font_dir}/segoeuib.ttf", 19)
    f_desc = ImageFont.truetype(f"{font_dir}/segoeui.ttf", 17)
    f_pill_title = ImageFont.truetype(f"{font_dir}/segoeuib.ttf", 15)
    f_pill_sub = ImageFont.truetype(f"{font_dir}/segoeui.ttf", 13)
    f_meta = ImageFont.truetype(f"{font_dir}/segoeui.ttf", 14)

    # 2. Right Side: Dipta Saha Portrait Photo
    photo_path = "e:/my cv 2025/Portfolio-website-2026/dipta-saha.jpg"
    if os.path.exists(photo_path):
        portrait = Image.open(photo_path).convert("RGBA")
        pw, ph = 420, 520
        src_w, src_h = portrait.size
        target_ratio = pw / ph
        src_ratio = src_w / src_h

        if src_ratio > target_ratio:
            new_w = int(src_h * target_ratio)
            left = (src_w - new_w) // 2
            portrait = portrait.crop((left, 0, left + new_w, src_h))
        else:
            new_h = int(src_w / target_ratio)
            portrait = portrait.crop((0, 0, src_w, new_h))

        portrait = portrait.resize((pw, ph), Image.Resampling.LANCZOS)

        # Rounded mask
        mask = Image.new("L", (pw, ph), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([(0, 0), (pw, ph)], radius=20, fill=255)

        px, py = 725, 55

        # Glowing Neon Double Border around portrait
        photo_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        pg_draw = ImageDraw.Draw(photo_glow)
        pg_draw.rounded_rectangle([(px - 3, py - 3), (px + pw + 3, py + ph + 3)], radius=23, outline=(6, 182, 212, 220), width=3)
        pg_draw.rounded_rectangle([(px - 6, py - 6), (px + pw + 6, py + ph + 6)], radius=26, outline=(99, 102, 241, 130), width=2)
        img.paste(photo_glow, (0, 0), photo_glow)

        img.paste(portrait, (px, py), mask)

        # Floating Status Badge at bottom of portrait
        badge_w, badge_h = 230, 36
        bx, by = px + (pw - badge_w) // 2, py + ph - 48
        badge_bg = Image.new("RGBA", (badge_w, badge_h), (6, 10, 24, 235))
        b_draw = ImageDraw.Draw(badge_bg)
        b_draw.rounded_rectangle([(0, 0), (badge_w, badge_h)], radius=18, outline=(16, 185, 129, 230), width=1)
        b_draw.ellipse([(14, 13), (24, 23)], fill=(16, 185, 129))
        b_draw.text((32, 9), "Available for Projects", fill="#34D399", font=f_badge)
        img.paste(badge_bg, (bx, by), badge_bg)

    # 3. Left Side Content
    lx = 65

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

    # 3 Pillar Feature Cards (Left side)
    cards = [
        ("Flutter Mobile Architecture", "App Store & Google Play • Firebase • Offline Sync", (56, 189, 248)),
        ("Full-Stack Web Platforms", "Next.js 14 • Node.js • ASP.NET • High-Traffic APIs", (129, 140, 248)),
        ("Python & Applied AI Systems", "YOLO Computer Vision • FastAPI • Docker Pipelines", (192, 132, 252))
    ]

    cy = 352
    for title, subtitle, color in cards:
        draw.rounded_rectangle([(lx, cy), (lx + 590, cy + 48)], radius=10, fill=(13, 19, 38, 220), outline=color, width=1)
        # Left color indicator dot
        draw.ellipse([(lx + 14, cy + 20), (lx + 22, cy + 28)], fill=color)
        draw.text((lx + 32, cy + 7), title, fill="#FFFFFF", font=f_pill_title)
        draw.text((lx + 32, cy + 27), subtitle, fill="#94A3B8", font=f_pill_sub)
        cy += 56

    # Bottom Contact Bar
    draw.line([(lx, 536), (lx + 590, 536)], fill=(255, 255, 255, 30), width=1)
    draw.text((lx, 548), "Dhaka, Bangladesh   •   github.com/didipta   •   sdipta707@gmail.com", fill="#64748B", font=f_meta)

    # Export
    out_png = "e:/my cv 2025/Portfolio-website-2026/og-image.png"
    out_jpg = "e:/my cv 2025/Portfolio-website-2026/og-image.jpg"
    out_preview = "e:/my cv 2025/Portfolio-website-2026/og-preview.jpg"

    img.save(out_png, "PNG", optimize=True)
    img.save(out_jpg, "JPEG", quality=95, optimize=True)
    img.save(out_preview, "JPEG", quality=95, optimize=True)
    print("Regenerated:", out_png, out_jpg)

if __name__ == "__main__":
    create_og_image()
