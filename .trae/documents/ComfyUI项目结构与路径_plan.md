# ComfyUI 项目结构与路径优化计划

## 问题分析

用户反馈当前文档中的路径 `ComfyUI/models/checkpoints/` 不够具体，难以理解实际位置。用户提供的桌面端路径是：
`E:\Dev\DevEnvironment\ComfyUI\resources\ComfyUI\models\checkpoints`

这说明桌面端的实际目录结构比文档中描述的更深，需要修正。

## 需要确认的问题

1. **桌面端完整路径结构是什么？**
   - 用户提供：`E:\Dev\DevEnvironment\ComfyUI\resources\ComfyUI\models\checkpoints`
   - 比标准 `ComfyUI/ComfyUI/models/` 多了一层 `resources`

2. **GitHub 版的实际路径是什么？**
   - 标准：`ComfyUI/models/checkpoints/`
   - 需要确认是否正确

3. **如何找到正确的模型目录？**

## 优化策略

### 1. 创建 ComfyUI 项目结构详解文档

包含：
- GitHub 版目录结构
- 桌面端目录结构（多种变体）
- 如何找到自己的模型目录
- 图解说明

### 2. 更新所有案例中的路径说明

- 使用更清晰的路径描述
- 标注"请根据实际安装位置调整"
- 提供路径查找方法

### 3. 添加路径查找指南

- 桌面端：菜单 > Settings > Directories
- GitHub 版：查看启动输出
- 通用：搜索模型文件名

## 需要修改的文件

### 新增文档
- docs/实战案例/ComfyUI项目结构详解.md

### 更新文档
- docs/实战案例/版本差异指南.md
- docs/实战案例/Level1-入门级/案例1.1-第一个文生图工作流.md
- docs/实战案例/Level1-入门级/案例1.5-模型管理实战.md
- docs/实战案例/Level2-进阶级/案例2.1-ControlNet深度控制实战.md
- docs/实战案例/Level2-进阶级/案例2.3-InstantID人脸一致性实战.md
- docs/实战案例/Level3-高级/案例3.1-AnimateDiff视频生成实战.md
- docs/技术清单.md（汇总路径信息）

## 执行步骤

1. 创建项目结构详解文档
2. 更新版本差异指南中的路径说明
3. 更新所有案例文档的路径描述
4. 添加路径查找方法

## 路径格式示例

### GitHub 版（标准结构）
```
E:\Dev\DevEnvironment\ComfyUI\
├── models\
│   ├── checkpoints\
│   ├── vae\
│   └── controlnet\
├── custom_nodes\
├── output\
└── main.py
```

### 桌面端（用户提供的结构）
```
E:\Dev\DevEnvironment\ComfyUI\
├── resources\
│   └── ComfyUI\
│       ├── models\
│       │   ├── checkpoints\
│       │   ├── vae\
│       │   └── controlnet\
│       └── custom_nodes\
├── output\
└── ComfyUI.exe
```

## 关键改进点

1. **路径要写完整**：不要只写 `models/checkpoints/`，要写完整路径
2. **标注可调整**：说明"请根据实际安装位置替换前面的路径"
3. **提供查找方法**：告诉用户如何找到自己的模型目录
4. **图解说明**：用树形结构展示完整目录