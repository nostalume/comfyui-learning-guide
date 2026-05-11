# 版本差异详细说明计划

## 问题分析

用户反馈实战案例中存在以下问题：
1. 桌面版和 GitHub 版操作细节不一样
2. 桌面版下载模型后不知道放在哪
3. 两种版本的目录结构有差异
4. 需要为每种版本提供明确的操作指南

## 优化策略

### 1. 统一目录结构说明
- GitHub 版目录结构
- 桌面版目录结构
- 模型放置位置对照表

### 2. 为每个案例添加版本差异说明
- 前置条件：区分两种版本的准备工作
- 所需资源：两种版本的下载和放置说明
- 实战步骤：两种版本的操作差异
- 验证步骤：两种版本的验证方法

### 3. 创建通用版本差异指南
- 专门的页面说明两种版本的核心差异
- 常见操作对照表
- 问题排查指南

## 需要修改的文件

### Level 1 - 入门级
- 案例1.1-第一个文生图工作流.md
- 案例1.5-模型管理实战.md

### Level 2 - 进阶级
- 案例2.1-ControlNet深度控制实战.md
- 案例2.2-ControlNet姿态控制实战.md
- 案例2.3-InstantID人脸一致性实战.md
- 案例2.4-IPAdapter风格迁移实战.md

### Level 3 - 高级
- 案例3.1-AnimateDiff视频生成实战.md
- 案例3.2-视频转绘实战.md

### 新增文件
- docs/实战案例/版本差异指南.md

## 执行步骤

1. 创建版本差异指南文档
2. 更新 Level 1 案例
3. 更新 Level 2 案例
4. 更新 Level 3 案例
5. 更新技术清单

## 关键内容

### 目录结构差异

**GitHub 版：**
```
ComfyUI/
├── models/
│   ├── checkpoints/
│   ├── vae/
│   └── ...
└── custom_nodes/
```

**桌面版：**
```
ComfyUI/
├── ComfyUI/
│   ├── models/
│   │   ├── checkpoints/
│   │   ├── vae/
│   │   └── ...
│   └── custom_nodes/
└── (其他配置文件)
```

### 模型放置目录对照

| 模型类型 | GitHub 版路径 | 桌面版路径 |
|---------|-------------|-----------|
| Checkpoint | models/checkpoints/ | ComfyUI/models/checkpoints/ |
| VAE | models/vae/ | ComfyUI/models/vae/ |
| ControlNet | models/controlnet/ | ComfyUI/models/controlnet/ |
| LoRA | models/lora/ | ComfyUI/models/lora/ |