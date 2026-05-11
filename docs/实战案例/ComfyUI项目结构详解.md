# ComfyUI 项目结构详解

> **最后更新：** 2026-04-29
> **适用版本：** ComfyUI GitHub 版 / 桌面端
> **重要提示：** 路径中的 `ComfyUI` 指的是你安装 ComfyUI 的那个文件夹，不是固定的名称！

---

## 📋 功能描述

本文档详细解析 ComfyUI 的项目目录结构，帮助用户：
- 理解不同安装方式下的目录差异
- 准确定位模型、节点包、输出文件的位置
- 解决模型加载失败、路径找不到等常见问题
- 掌握正确的文件组织方式

**适用人群：**
- 初次安装 ComfyUI 的新手
- 遇到模型加载问题的用户
- 需要迁移或备份配置的用户
- 想要了解 ComfyUI 内部结构的开发者

---

## 📁 详细内容

### 一、核心概念：模型扫描机制

#### 1.1 为什么有些路径找不到模型？

很多用户会遇到这样的困惑：为什么两个看起来很相似的路径，一个能找到模型，另一个却找不到？

**例如：**
- ✅ `E:\Dev\DevEnvironment\ComfyUI_SDK\models\checkpoints\` - 能找到模型
- ❌ `E:\Dev\DevEnvironment\ComfyUI\resources\ComfyUI\models\checkpoints\` - 找不到模型

#### 1.2 核心原因：ComfyUI 的模型扫描机制

ComfyUI 在启动时，只会扫描特定目录下的模型文件。这个目录称为「模型根目录」，默认是：

```
{你的ComfyUI安装目录}/models/
```

**只有放在这个 `models/` 目录下的子文件夹中的模型，才会被 ComfyUI 加载！**

#### 1.3 为什么会有路径差异？

| 原因类型 | 详细说明 |
|---------|---------|
| **安装方式不同** | GitHub 版：你自己克隆到任意目录，模型放在克隆目录的 `models/` 下<br>桌面端：安装程序可能创建多层目录结构 |
| **安装位置自定义** | 你可能将 ComfyUI 安装到了自定义路径（如 `ComfyUI_SDK`）<br>但系统或文档可能指向默认安装路径（如 `ComfyUI`） |
| **目录结构误解** | 桌面端安装后可能有多个嵌套的 `ComfyUI` 文件夹<br>只有包含 `main.py` 或 `models/` 的那个才是真正的程序目录 |

---

### 二、找到你的 ComfyUI 安装目录

#### 2.1 方法 1：桌面端用户（推荐）

**步骤：**
1. 打开 ComfyUI 桌面端
2. 点击顶部菜单 `Settings`（设置）
3. 选择 `Directories`（目录）
4. 查看 `Models` 路径

> 💡 **典型路径示例：**
> - `E:\Dev\DevEnvironment\ComfyUI\resources\ComfyUI\models`
> - `C:\Users\用户名\AppData\Local\Programs\ComfyUI\ComfyUI\models`
> - `D:\AI Tools\ComfyUI\resources\ComfyUI\models`

#### 2.2 方法 2：GitHub 版用户

**步骤：**
1. 进入你克隆 ComfyUI 的文件夹
2. 查看是否有 `main.py` 文件
3. 模型目录是 `models` 子文件夹

**典型路径：**
```
E:\Dev\DevEnvironment\ComfyUI\
└── models\          ← 模型放在这里
```

#### 2.3 方法 3：搜索模型文件

**Windows 搜索：**
1. 打开文件资源管理器
2. 搜索 `v1-5-pruned-emaonly.safetensors`
3. 找到文件后，上一级目录就是 `models`

#### 2.4 方法 4：检查启动日志（最可靠）

1. 启动 ComfyUI
2. 查看控制台输出
3. 找到类似这样的日志：
   ```
   Loaded X models from E:\Dev\DevEnvironment\ComfyUI_SDK\models\checkpoints
   ```
4. **这就是你的模型应该放的位置！**

---

### 三、GitHub 版目录结构详解

```
📁 E:\Dev\DevEnvironment\ComfyUI\          ← 这是"ComfyUI根目录"（你安装的位置）
├── 📁 models\                            ← 模型文件放在这里
│   ├── 📁 checkpoints\                   ← 大模型（SD 1.5/SDXL/其他）
│   │   ├── v1-5-pruned-emaonly.safetensors
│   │   ├── anything-v4.5-pruned.safetensors
│   │   └── 其他大模型.safetensors
│   ├── 📁 vae\                          ← VAE模型
│   │   ├── vae-ft-mse-840000-ema-pruned.safetensors
│   │   └── sdxl_vae.safetensors
│   ├── 📁 lora\                         ← LoRA模型
│   │   └── detail_tweaker_v2.safetensors
│   ├── 📁 controlnet\                   ← ControlNet模型
│   │   ├── control_v11f1p_sd15_depth.pth
│   │   └── control_v11p_sd15_openpose.pth
│   ├── 📁 clip_vision\                  ← CLIP Vision模型
│   ├── 📁 ipadapter\                    ← IP-Adapter模型
│   ├── 📁 instantid\                    ← InstantID模型
│   ├── 📁 insightface\                  ← InsightFace模型
│   │   └── antelopev2\                  ← 解压后的文件夹
│   ├── 📁 animatediff\                  ← AnimateDiff运动模型
│   │   └── mm_sd_v3.ckpt
│   └── 📁 upscale_models\               ← 放大模型
│       └── RealESRGAN_x4plus.pth
├── 📁 custom_nodes\                     ← 自定义节点包
│   ├── 📁 ComfyUI-Manager\
│   ├── 📁 ComfyUI-AnimateDiff-Evolved\
│   └── 📁 ComfyUI_InstantID\
├── 📁 output\                           ← 生成结果输出
├── 📄 main.py                           ← 启动文件
├── 📄 run_nvidia_gpu.bat                ← Windows启动脚本
└── 📄 requirements.txt                  ← 依赖列表
```

#### 3.1 核心目录说明

| 目录/文件 | 作用说明 | 重要程度 |
|----------|---------|---------|
| `models/` | 所有模型文件的存放目录 | ⭐⭐⭐⭐⭐ |
| `custom_nodes/` | 第三方节点包安装目录 | ⭐⭐⭐⭐ |
| `output/` | 生成图片的默认输出目录 | ⭐⭐⭐ |
| `main.py` | 程序主入口文件 | ⭐⭐⭐⭐⭐ |
| `requirements.txt` | Python 依赖列表 | ⭐⭐⭐ |
| `run_nvidia_gpu.bat` | Windows NVIDIA 显卡启动脚本 | ⭐⭐⭐ |

#### 3.2 models 子目录详解

| 子目录 | 存放内容 | 文件格式 | 典型大小 |
|-------|---------|---------|---------|
| `checkpoints/` | 大模型（SD 1.5/SDXL/Flux） | `.safetensors`, `.ckpt` | 2-10GB |
| `vae/` | VAE 变分自编码器 | `.safetensors` | 300MB-2GB |
| `lora/` | LoRA 微调模型 | `.safetensors` | 50-500MB |
| `controlnet/` | ControlNet 控制模型 | `.pth`, `.safetensors` | 1-2GB |
| `clip_vision/` | CLIP 视觉编码器 | `.safetensors` | 1-2GB |
| `ipadapter/` | IP-Adapter 模型 | `.safetensors` | 1-2GB |
| `instantid/` | InstantID 人脸模型 | `.bin` | 1-2GB |
| `insightface/` | InsightFace 人脸识别 | 文件夹 | 300MB |
| `animatediff/` | AnimateDiff 运动模型 | `.ckpt` | 2-4GB |
| `upscale_models/` | 图像放大模型 | `.pth` | 50-100MB |

> 📌 **关键点：** GitHub版的模型直接放在 `models\` 下的各个子文件夹中

---

### 四、桌面端目录结构详解

> ⚠️ **重要：** 桌面端的路径通常比GitHub版更深！

#### 4.1 典型结构（用户提供的路径）

```
📁 E:\Dev\DevEnvironment\ComfyUI\         ← 桌面端安装根目录
├── 📁 resources\                          ← 资源文件夹
│   └── 📁 ComfyUI\                       ← 实际程序文件夹
│       ├── 📁 models\                    ← 模型文件放在这里
│       │   ├── 📁 checkpoints\
│       │   │   └── v1-5-pruned-emaonly.safetensors
│       │   ├── 📁 vae\
│       │   ├── 📁 lora\
│       │   ├── 📁 controlnet\
│       │   └── ...（其他模型目录）
│       └── 📁 custom_nodes\              ← 自定义节点包
├── 📁 output\                            ← 生成结果
└── 📄 ComfyUI.exe                        ← 启动程序
```

#### 4.2 另一种可能的结构

```
📁 C:\Users\用户名\AppData\Local\Programs\ComfyUI\
├── 📁 ComfyUI\                           ← 实际程序文件夹
│   ├── 📁 models\                        ← 模型文件
│   └── 📁 custom_nodes\                 ← 自定义节点
└── 📄 ComfyUI.exe
```

> 📌 **关键点：** 桌面端的模型在 `resources\ComfyUI\models\` 下

#### 4.3 桌面端特殊目录说明

| 目录/文件 | 作用说明 |
|----------|---------|
| `ComfyUI.exe` | 桌面端启动程序 |
| `resources/` | 资源文件夹，包含实际程序 |
| `resources/ComfyUI/` | 实际运行的 ComfyUI 程序目录 |

---

### 五、模型存放位置速查表

> ⚠️ **重要：** 请将示例路径替换为你实际的程序文件夹路径！

#### 5.1 模型类型与存放位置对照

| 模型类型 | 文件后缀 | GitHub版路径 | 桌面端路径 |
|---------|---------|-------------|-----------|
| 大模型 | `.safetensors` | `models\checkpoints\` | `resources\ComfyUI\models\checkpoints\` |
| VAE | `.safetensors` | `models\vae\` | `resources\ComfyUI\models\vae\` |
| LoRA | `.safetensors` | `models\lora\` | `resources\ComfyUI\models\lora\` |
| ControlNet | `.pth` / `.safetensors` | `models\controlnet\` | `resources\ComfyUI\models\controlnet\` |
| CLIP Vision | `.safetensors` | `models\clip_vision\` | `resources\ComfyUI\models\clip_vision\` |
| IP-Adapter | `.safetensors` | `models\ipadapter\` | `resources\ComfyUI\models\ipadapter\` |
| InstantID | `.bin` | `models\instantid\` | `resources\ComfyUI\models\instantid\` |
| InsightFace | 文件夹 | `models\insightface\antelopev2\` | `resources\ComfyUI\models\insightface\antelopev2\` |
| AnimateDiff | `.ckpt` | `models\animatediff\` | `resources\ComfyUI\models\animatediff\` |
| 放大模型 | `.pth` | `models\upscale_models\` | `resources\ComfyUI\models\upscale_models\` |

---

### 六、路径缩写说明

在文档中，我们会使用以下缩写：

| 缩写 | 含义 |
|-----|------|
| `{ComfyUI根目录}` | 你安装 ComfyUI 的文件夹 |
| `{你的用户名}` | Windows 用户名 |
| `models\checkpoints\` | 大模型文件夹 |

> 📌 **实际使用时，请将括号内的内容替换为你实际的路径！**

#### 举例

文档中写：
```
{ComfyUI根目录}\models\checkpoints\
```

如果你的安装路径是 `E:\Dev\DevEnvironment\ComfyUI\`，那就改成：
```
E:\Dev\DevEnvironment\ComfyUI\models\checkpoints\
```

---

### 七、版本差异总结

| 特性 | GitHub版 | 桌面端 |
|-----|---------|--------|
| 模型根目录 | `{ComfyUI根目录}\models\` | `{ComfyUI根目录}\resources\ComfyUI\models\` |
| 节点包目录 | `{ComfyUI根目录}\custom_nodes\` | `{ComfyUI根目录}\resources\ComfyUI\custom_nodes\` |
| 启动方式 | 命令行 `python main.py` | 双击 `ComfyUI.exe` |
| 更新方式 | `git pull` | 自动更新 |
| 配置方式 | 编辑配置文件 | 图形界面设置 |

---

## 🎯 使用场景

### 场景 1：我下载了一个大模型，应该放哪？

**步骤：**
1. 先确认你的 ComfyUI 版本（GitHub版 or 桌面端）
2. 找到你的 `models\checkpoints\` 文件夹
3. 将 `.safetensors` 或 `.ckpt` 文件放入该目录
4. 重启 ComfyUI 或点击刷新按钮

**具体路径示例：**
```
GitHub版: E:\Dev\DevEnvironment\ComfyUI\models\checkpoints\
桌面端: E:\Dev\DevEnvironment\ComfyUI\resources\ComfyUI\models\checkpoints\
```

### 场景 2：ComfyUI 里加载不了模型？

**检查清单：**
1. ✅ 模型文件是否在正确的子文件夹？
2. ✅ 文件名是否完整？（`.safetensors` 不能写成 `.safetensor`）
3. ✅ 重启 ComfyUI 了吗？
4. ✅ 磁盘空间够吗？
5. ✅ 文件是否损坏？（尝试重新下载）

### 场景 3：不确定自己的路径是什么？

**最简单的方法：**
1. 在 ComfyUI 界面添加一个 `Load Checkpoint` 节点
2. 点击下拉框，看里面显示的路径
3. 或者点击 `Settings > Directories` 查看

### 场景 4：如何迁移模型到新电脑？

**步骤：**
1. 复制整个 `models` 文件夹
2. 在新电脑上安装 ComfyUI
3. 将 `models` 文件夹粘贴到对应位置
4. 重启 ComfyUI

### 场景 5：如何备份我的配置？

**需要备份的目录：**
- `models/` - 所有模型文件
- `custom_nodes/` - 安装的节点包
- `output/` - 生成的图片（可选）

---

## ❓ 常见问题

### Q1: 我怎么知道用的是GitHub版还是桌面端？

**GitHub版特征：**
- 文件夹里有 `main.py`
- 启动用命令行 `python main.py`
- 需要手动配置 Python 环境

**桌面端特征：**
- 有 `ComfyUI.exe`
- 点击图标启动
- 无需配置环境

### Q2: 模型放错了文件夹会怎样？

- ❌ 可能加载不出来
- ✅ 不会损坏模型文件
- ✅ 移到正确位置后重载即可

### Q3: 路径里出现 `AppData` 是什么情况？

这是 Windows 的隐藏文件夹，用于存储程序数据。桌面端有时会安装到这里：
```
C:\Users\你的用户名\AppData\Local\Programs\ComfyUI\
```

**访问方法：**
1. 按 `Win+R`
2. 输入 `%appdata%`
3. 回车

### Q4: 为什么桌面端有两个 ComfyUI 文件夹？

桌面端安装时会创建一个包装目录：
```
ComfyUI\              ← 安装目录
└── ComfyUI\          ← 实际程序目录
    └── models\       ← 模型放这里！
```

**记住：** 模型要放在包含 `models` 文件夹的那个 `ComfyUI` 目录里！

### Q5: 如何确认模型是否正确安装？

**验证步骤：**
1. 启动 ComfyUI
2. 添加 `Load Checkpoint` 节点
3. 点击 `ckpt_name` 下拉框
4. 如果能看到你的模型名称，说明安装成功

### Q6: 模型文件太大，可以放在其他盘吗？

**方法 1：创建符号链接（推荐）**
```powershell
# 以管理员身份运行 PowerShell
mklink /D "E:\ComfyUI\models\checkpoints" "D:\Models\checkpoints"
```

**方法 2：修改配置文件**
编辑 `extra_model_paths.yaml`，添加额外的模型路径。

### Q7: 两个路径很相似，哪个是对的？

**判断方法：**
1. 查看 ComfyUI 设置中的 `Directories`
2. 检查启动日志中的加载路径
3. 以 ComfyUI 实际扫描的路径为准

### Q8: 如何清理不需要的模型？

**步骤：**
1. 进入对应的模型目录
2. 删除不需要的 `.safetensors` 或 `.pth` 文件
3. 重启 ComfyUI

> ⚠️ **注意：** 删除前确认模型不再需要，建议先备份！

---

## 📚 相关文档

- [版本差异指南](./版本差异指南.md) - GitHub版与桌面端详细对比
- [技术清单](./技术清单.md) - 模型下载链接和版本信息
- [学习检查清单](./学习检查清单.md) - 学习进度自测

---

> 📅 **更新日期：** 2026-04-29
