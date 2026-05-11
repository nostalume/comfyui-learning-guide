# ComfyUI 学习文档整理优化 Spec

## Why

当前学习文档存在以下核心问题：1）同编号文件重复（如 `1.2-节点类型.md` 与 `节点.md`、`节点介绍.md` 内容高度重复）；2）英文节点名缺少中文注释，不符合中文友好要求；3）大量内容未参照官方文档（英文 docs.comfy.org 和中文 docs.comfy.org/zh）；4）版本信息严重过时（文档记录 v0.21.0，实际最新为 v0.3.49）；5）部分内容缺乏实际使用方法指导，偏理论空泛。需要系统性整理优化，使文档成为参照官方技术文档的、可实操的学习指南。

## What Changes

- **合并重复文件**：将同编号的重复文件合并为单一文件，删除冗余旧文件
- **英文节点名添加中文注释**：所有英文节点名后接中文注释，格式为 `英文名（中文名）`，如 `Load Checkpoint（加载大模型）`、`KSampler（K采样器）`
- **参照官方文档校准内容**：所有文档内容参照官方英文文档（docs.comfy.org）和中文文档（docs.comfy.org/zh），确保与官方一致
- **更新版本信息与时效性标注**：更新 ComfyUI 版本号至最新（v0.3.49），检查开源项目维护状态，标注可能随时间变化的内容
- **强化实操使用方法**：每个工具/节点/技术都要有具体的"怎么用"指导，参照官方推荐用法
- **统一文件编号**：消除同编号多文件的混乱，确保编号唯一

## Impact

- Affected specs: 全部 9 章学习文档 + 实战案例 + 辅助文档
- Affected code: 所有 docs/ 目录下的 markdown 文件
- **BREAKING**: 将删除重复的旧文件，文件路径会变化

## ADDED Requirements

### Requirement: 重复文件合并

系统必须将所有同编号重复文件合并为单一文件，消除内容冗余。

#### 合并清单

**第1章 概述与安装部署（6个重复文件需合并/删除）：**
- `1.2-节点类型.md` 保留（内容最详细），`节点.md` 和 `节点介绍.md` 删除（内容几乎完全重复）
- `1.3-Windows安装.md` 和 `1.3-连线逻辑.md` 重新编号，消除编号冲突
- `1.4-macOS安装.md` 和 `1.4-工作流保存加载分享.md` 重新编号
- `1.5-启动与访问.md` 和 `1.5-安装部署文档.md` 合并
- `ComfyUI 与 Stable Diffusion WebUI对比.md` 合并到 `1.1-与WebUI的差异对比.md`
- `连线.md` 合并到 `1.3-连线逻辑.md`
- `工作流保存.md` 合并到 `1.4-工作流保存加载分享.md`

**第2章 模型体系与管理（3个编号冲突）：**
- `2.2-Civitai下载教程.md` 合并到 `2.2-模型下载渠道.md`
- `2.3-HuggingFace下载教程.md` 合并到 `2.3-Checkpoint大模型.md` 或独立编号
- `2.4-模型放置位置.md` 合并到 `2.4-ControlNet模型.md` 或独立编号

**第3章 基础工作流搭建（3个编号冲突）：**
- `3.1-文生图标准工作流.md` 和 `3.1-文生图详细教程.md` 合并
- `3.2-图生图工作流.md` 和 `3.2-图生图详细教程.md` 合并
- `3.3-提示词入门.md` 和 `3.3-高清修复工作流.md` 重新编号

#### Scenario: 用户查看节点类型文档

- **WHEN** 用户打开第1章查看节点类型
- **THEN** 只有一个 `1.2-节点类型.md` 文件，不存在 `节点.md` 和 `节点介绍.md` 重复文件

### Requirement: 英文节点名中文注释

所有英文节点名必须后接中文注释，格式为 `英文名（中文名）`，保留原生节点名的同时实现中文友好。

#### 标注规范

1. **节点标题**：`### Load Checkpoint（加载大模型）`
2. **节点首次出现**：使用 `英文名（中文名）` 格式
3. **节点再次出现**：可使用中文名或简称
4. **端口/参数名**：保留英文原名，括号注释中文，如 `ckpt_name（模型文件名）`
5. **参照官方中文文档**：中文名优先采用官方中文文档的翻译，如官方称"K 采样器"则用"K采样器"而非"采样器"

#### 官方中文文档参考对照

参照 `https://docs.comfy.org/zh/` 的节点翻译：
- Load Checkpoint → 加载模型（Load Checkpoint）
- CLIP Text Encode → CLIP文本编码器（CLIP Text Encoder）
- KSampler → K采样器（KSampler）
- Empty Latent Image → 空Latent图像（Empty Latent Image）
- VAE Decode → VAE解码（VAE Decode）
- VAE Encode → VAE编码（VAE Encode）
- Save Image → 保存图像（Save Image）
- Preview Image → 预览图像（Preview Image）
- Load LoRA → 加载LoRA（Load LoRA）
- Load VAE → 加载VAE（Load VAE）
- Load ControlNet Model → 加载ControlNet模型（Load ControlNet Model）

#### Scenario: 用户阅读节点文档

- **WHEN** 用户阅读包含英文节点名的文档
- **THEN** 每个英文节点名首次出现时都有中文注释，格式为 `英文名（中文名）`

### Requirement: 参照官方文档校准

所有文档内容必须参照 ComfyUI 官方英文文档和中文文档，确保准确性和严谨性。

#### 官方文档引用规范

1. 每个文档顶部必须包含官方文档引用链接
2. 英文官方文档：`https://docs.comfy.org/`
3. 中文官方文档：`https://docs.comfy.org/zh/`
4. 内置节点文档：`https://docs.comfy.org/built-in-nodes/overview`
5. 教程参考：`https://docs.comfy.org/tutorials/basic/text-to-image`
6. 中文教程参考：`https://docs.comfy.org/zh/tutorials/basic/text-to-image`

#### 校准原则

1. 节点参数说明以官方文档为准
2. 工作流步骤参照官方教程
3. 概念解释参照官方中文文档的翻译和解释
4. 如与官方文档有差异，以官方文档为准并标注差异
5. 官方文档未覆盖的内容，标注"非官方内容，仅供参考"

#### Scenario: 用户查看节点参数

- **WHEN** 用户查看 KSampler 节点的参数说明
- **THEN** 参数说明与官方文档一致，文档顶部有官方文档引用链接

### Requirement: 时效性检查与版本更新

所有文档必须检查并更新版本信息，标注可能随时间变化的内容。

#### 版本更新清单

1. **ComfyUI 核心版本**：从 v0.21.0 更新至 v0.3.49（当前最新）
2. **技术清单中的版本号**：全部更新至最新
3. **版本兼容性矩阵**：更新至 v0.3.x 系列
4. **依赖库版本**：更新 PyTorch、xFormers 等版本要求
5. **节点包维护状态**：检查每个节点包的最新维护状态

#### 时效性标注规范

1. 每个文档顶部标注 `文档版本` 和 `最后更新` 日期
2. 可能随时间变化的内容用 `⚠️ 时效性说明` 标注
3. 开源项目维护状态标注：🟢活跃 / 🟡维护 / 🔴停止
4. 版本相关内容标注适用的版本范围

#### Scenario: 用户查看技术清单

- **WHEN** 用户查看技术清单中的版本信息
- **THEN** ComfyUI 版本号为 v0.3.49，各节点包维护状态为最新

### Requirement: 实操使用方法强化

每个工具/节点/技术都必须有具体的"怎么用"指导，参照官方推荐用法，确保学习文档不是空中楼阁。

#### 实操内容要求

1. **节点文档**：必须包含操作步骤（在哪里找到、如何添加、如何连接）
2. **工作流文档**：必须包含从零搭建的完整步骤
3. **模型文档**：必须包含下载、放置、验证的完整流程
4. **插件文档**：必须包含安装、配置、使用的完整步骤
5. **参数文档**：必须包含推荐值和调整效果说明

#### 参照官方推荐

1. 文生图工作流参照官方教程：`https://docs.comfy.org/zh/tutorials/basic/text-to-image`
2. 节点操作参照官方界面指南：`https://docs.comfy.org/zh/interface/overview`
3. 安装部署参照官方安装指南：`https://docs.comfy.org/zh/installation/system_requirements`

#### Scenario: 用户学习文生图

- **WHEN** 用户阅读文生图工作流文档
- **THEN** 能够按照步骤从零搭建工作流并成功生成图片，步骤与官方教程一致

## MODIFIED Requirements

### Requirement: 文档结构统一

所有文档必须遵循统一的结构模板：
1. 文档元信息（版本、官方文档引用、适合人群）
2. 功能描述（通俗易懂）
3. 使用场景
4. 详细内容（实操步骤为主）
5. 注意事项（含时效性标注）
6. 常见问题
7. 相关资源（含官方文档链接）

### Requirement: 文件编号唯一

每个章节内的文件编号必须唯一，不允许同编号多文件。合并后重新编号确保连续性。

## REMOVED Requirements

### Requirement: 旧版冗余文件

**Reason**: 同编号重复文件造成内容冗余和读者困惑
**Migration**: 合并内容到保留文件后删除冗余文件，更新 SUMMARY.md 中的引用
