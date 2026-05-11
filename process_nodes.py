import os
import re

node_translations = [
    ("Load ControlNet Model", "加载ControlNet模型"),
    ("Apply ControlNet", "应用ControlNet"),
    ("Empty Latent Image", "空Latent图像"),
    ("CLIP Text Encoder", "CLIP文本编码器"),
    ("CLIP Text Encode", "CLIP文本编码器"),
    ("Load Checkpoint", "加载模型"),
    ("Upscale Image", "放大图像"),
    ("Preview Image", "预览图像"),
    ("Load LoRA", "加载LoRA"),
    ("Save Image", "保存图像"),
    ("Load Image", "加载图像"),
    ("VAE Decode", "VAE解码"),
    ("VAE Encode", "VAE编码"),
    ("Load VAE", "加载VAE"),
    ("KSampler", "K采样器"),
]

header_ref_line = "> **相关官方文档：** [ComfyUI 官方文档](https://docs.comfy.org/) | [中文文档](https://docs.comfy.org/zh/)"

base = r"e:\Dev\DevWorkspace\comfyui-learning-guide\docs\实战案例"

files = []
for level_dir in ["Level1-入门级", "Level2-进阶级", "Level3-高级", "Level4-专家级", "Level5-大牛级"]:
    level_path = os.path.join(base, level_dir)
    if os.path.isdir(level_path):
        for f in sorted(os.listdir(level_path)):
            if f.endswith(".md"):
                files.append(os.path.join(level_path, f))

def add_header_ref(content):
    if "docs.comfy.org/zh/" in content:
        return content

    lines = content.split('\n')
    header_end_idx = -1
    for i, line in enumerate(lines):
        if line.startswith('> '):
            header_end_idx = i
        elif header_end_idx >= 0 and not line.startswith('> '):
            break

    if header_end_idx >= 0:
        lines.insert(header_end_idx + 1, header_ref_line)
        return '\n'.join(lines)
    return content

def annotate_first_occurrence(content):
    parts = re.split(r'(```[\s\S]*?```)', content)

    annotated = set()
    clip_done = False

    for i, part in enumerate(parts):
        if part.startswith('```'):
            continue

        for eng_name, chn_name in node_translations:
            if eng_name in annotated:
                continue
            if eng_name in ("CLIP Text Encode", "CLIP Text Encoder") and clip_done:
                continue

            idx = part.find(eng_name)
            if idx == -1:
                continue

            after_start = idx + len(eng_name)
            after_text = part[after_start:after_start + 30]

            if '（' in after_text:
                has_close = after_text.find('）')
                if has_close != -1 and has_close < 25:
                    annotated.add(eng_name)
                    if eng_name in ("CLIP Text Encode", "CLIP Text Encoder"):
                        clip_done = True
                    continue

            annotation = f"（{chn_name}）"
            part = part[:after_start] + annotation + part[after_start:]
            parts[i] = part

            annotated.add(eng_name)
            if eng_name in ("CLIP Text Encode", "CLIP Text Encoder"):
                clip_done = True

    return ''.join(parts)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = add_header_ref(content)
    content = annotate_first_occurrence(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Processed: {os.path.basename(filepath)}")

for filepath in files:
    process_file(filepath)

print(f"\nTotal files processed: {len(files)}")
