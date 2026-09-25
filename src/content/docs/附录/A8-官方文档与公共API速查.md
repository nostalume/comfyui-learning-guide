---
title: "A8 官方文档与公共 API 速查"
description: 官方文档地图与两代 API 对照：Cloud、专属部署与自托管各怎么调，官方 SDK 怎么用，输出 URL 的寿命有多长。
---

# A8 官方文档与公共 API 速查

> **相关官方文档：** [官方文档总入口](https://docs.comfy.org/) | [中文文档](https://docs.comfy.org/zh/) | [Comfy API v2 总览](https://docs.comfy.org/api-reference/v2/overview) | [官方 SDK](https://docs.comfy.org/development/api-development/sdks) | [内置 API 路由](https://docs.comfy.org/development/comfyui-server/comms_overview)
> **用途：** 查阅型附录 —— 三件事：① 官方文档哪一段对应本站哪一篇；② 「公共 API」其实有两代，先分清你说的是哪一个；③ 官方 Comfy API v2 与官方 SDK 的最小用法。
> **适合人群：** 要把 ComfyUI 接进别的系统的人（读 [5.4 API 调用](../5-自动化与批量生成/5.4-API调用.md) / [8.5 与内部系统对接](../8-与其他工具集成/8.5-与内部系统对接.md) 时对照使用）。

> ⚠️ **时效性：** Comfy API v2 目前是 **Beta（`0.1.x`）**，官方 SDK 是 **`0.4.0`**（pre-1.0）—— 方法名、事件目录、错误分类都还可能变。**本页只做导览，接口细节一律以官方页面为准**；v2 内部只做加法，破坏性改动会另开 v3。

---

## A8.1 官方文档地图：要什么去哪一页

官方文档的路径结构很规整，记住前缀就能自己找：

| 官方区块 | 讲什么 | 本站对应 |
|----------|--------|----------|
| [`/installation/`](https://docs.comfy.org/installation/system_requirements) | 系统要求、三条安装路径 | [A6.1 系统要求](./A6-安装部署参考.md) · [1.1 Windows](../1-概述与安装部署/1.1-Windows安装.md) · [1.2 macOS](../1-概述与安装部署/1.2-macOS安装.md) |
| [`/installation/desktop/`](https://docs.comfy.org/installation/desktop/windows) | Comfy Desktop（Windows / macOS） | 同上 |
| [`/installation/comfyui_portable_windows`](https://docs.comfy.org/installation/comfyui_portable_windows) | Windows 便携版（`run_nvidia_gpu.bat`） | [1.1](../1-概述与安装部署/1.1-Windows安装.md) |
| [`/installation/manual_install`](https://docs.comfy.org/installation/manual_install) | 手动安装（虚拟环境 + `main.py`） | [1.1](../1-概述与安装部署/1.1-Windows安装.md) |
| [`/development/comfyui-server/startup-flags`](https://docs.comfy.org/development/comfyui-server/startup-flags) | **全部启动参数**（逐条来自 `comfy/cli_args.py`） | [A6.4 启动参数](./A6-安装部署参考.md) |
| [`/development/comfyui-server/comms_overview`](https://docs.comfy.org/development/comfyui-server/comms_overview) | 内置服务器：REST 路由、WebSocket 消息 | [5.4 API 调用](../5-自动化与批量生成/5.4-API调用.md) |
| [`/basic-concepts/`](https://docs.comfy.org/basic-concepts/models) | 模型 / 工作流 / 自定义节点 / 依赖 | 第 1–2 章、第 6 章 |
| [`/built-in-nodes/`](https://docs.comfy.org/built-in-nodes/KSampler) | **单个内置节点一页**（`/built-in-nodes/KSampler` 这样直呼其名） | 第 6 章 |
| [`/custom-nodes/overview`](https://docs.comfy.org/custom-nodes/overview) | 写自定义节点的 API（在 ComfyUI **内部**运行） | 第 6 章 |
| [`/development/api-development/sdks`](https://docs.comfy.org/development/api-development/sdks) | 官方 SDK（Python / TypeScript） | 本页 A8.4 · [8.5](../8-与其他工具集成/8.5-与内部系统对接.md) |
| [`/development/api-development/getting-an-api-key`](https://docs.comfy.org/development/api-development/getting-an-api-key) | 怎么拿 API key | 本页 A8.3 |
| [`/development/api-development/workflow-api-format`](https://docs.comfy.org/development/api-development/workflow-api-format) | 「API 格式」工作流 JSON | [5.4.2](../5-自动化与批量生成/5.4-API调用.md) |
| [`/api-reference/v2/overview`](https://docs.comfy.org/api-reference/v2/overview) | **Comfy API v2**（公共 API） | 本页 A8.3 |
| [`/api-reference/cloud/`](https://docs.comfy.org/development/cloud/overview) | v1 云 API：额度、模型浏览、队列管理 | 本页 A8.3 「队列为什么不在 v2」 |
| [`/development/serverless/overview`](https://docs.comfy.org/development/serverless/overview) | 用 Developer Platform 部署专属环境 | 本页 A8.3 运行面② |
| [`/development/comfy-router/quickstart`](https://docs.comfy.org/development/comfy-router/quickstart) | Comfy Router：直接调合作方模型 | 本页 A8.4 「一个包两个面」 |
| [`/comfy-cli`](https://docs.comfy.org/comfy-cli) | 命令行工具 `comfy` | 本页 A8.5 |
| [`/agent-tools/mcp`](https://docs.comfy.org/agent-tools/mcp) · [`/agent-tools/skills`](https://docs.comfy.org/agent-tools/skills) | 让 AI Agent 直接操作 ComfyUI | 本页 A8.5（其余主线未覆盖） |
| [`/troubleshooting/overview`](https://docs.comfy.org/troubleshooting/overview) | 安装与运行报错排查 | [A6.6 常见问题排查](./A6-安装部署参考.md) |

> 💡 **中文页面的规律：** 在英文路径前加 `/zh/` 即可，例如 `docs.comfy.org/zh/installation/system_requirements`。个别页面用 `/zh-CN/`，找不到时去掉后缀试一次即可。

---

## A8.2 「公共 API」有两代，先分清是哪一代

这是最容易被文档混为一谈的地方：**说「ComfyUI 的 API」时，可能指两套完全不同的东西。**

| | **内置 API（俗称 v1）** | **官方 Comfy API v2** |
|---|---|---|
| 谁提供 | ComfyUI 进程自带，随你启动 | Comfy 官方的托管服务 |
| 地址 | `http://127.0.0.1:8188` | `https://cloud.comfy.org` 等三个运行面（见 A8.3） |
| 认证 | **没有** —— 谁能访问，谁就拿到你的 GPU | `Authorization: Bearer <api-key>` |
| 提交物 | 整份「API 格式」工作流 JSON | 同样是 API 格式工作流 JSON |
| 版本承诺 | 随 ComfyUI 版本变化 | 官方承诺长期支持；新版本 ComfyUI 不会破坏基于它的集成 |
| 讲在哪 | [5.4 API 调用](../5-自动化与批量生成/5.4-API调用.md) | 本页 A8.3、A8.4；[8.5](../8-与其他工具集成/8.5-与内部系统对接.md) |

**选哪个，只看一件事：工作流在哪台机器上跑。**

- 跑在**你自己的机器**（或你公司的服务器）上 → 用内置 API，[5.4](../5-自动化与批量生成/5.4-API调用.md) 讲的就是它，[8.5](../8-与其他工具集成/8.5-与内部系统对接.md) 讲怎么在它前面加一层网关。
- 跑在 **Comfy 托管的机器**上（不想自己准备显卡、也不想运维）→ 用 Comfy API v2，见下节。

> 💡 **两代可以并存。** 8.5 那套网关的「对内」部分仍然调内置 API；只有当它「对外」要把算力交给托管环境时，才换成 v2。**换的只是 base URL 与认证方式，工作流本身是同一份。**

---

## A8.3 Comfy API v2 速查

### 三个运行面：同一套 API，只换 base URL

官方刻意让 v2 由**三个运行面**提供同一套接口，这样一份集成代码改个地址就能迁移：

| 运行面 | Base URL | 认证 |
|--------|----------|------|
| **Comfy Cloud**（官方托管，多租户） | `https://cloud.comfy.org` | `Authorization: Bearer <api-key>` |
| **Comfy API 部署**（你在 Developer Platform 上部署的专属环境） | `https://{deployment}.run.comfy.app` | 同上（同一把 key） |
| **自托管 ComfyUI**（经 `comfy-api-proxy`，Beta 期间的过渡方案） | `http://127.0.0.1:8189` | **默认无认证**，可选静态 bearer token |

- API key 在工作台创建：[platform.comfy.org/profile/api-keys](https://platform.comfy.org/profile/api-keys)。**Comfy Cloud 的 API 访问需要付费订阅**，免费档不含；同时能跑几个任务是按档位限的。
- 专属部署「钉住」一个环境跑工作流，因此可以独立扩容，并且 `GET /workflow` 能取回真正执行的那张图。

### 端点只有两大类

| 类别 | 是什么 |
|------|--------|
| **Assets** | 以 UUID 标识的记录，底层字节按内容寻址 —— 上传输入、下载输出 |
| **Jobs** | 一次工作流执行。**持久、可轮询、可取消** |

### 四条设计原则（决定了你怎么写代码）

| 原则 | 对你的要求 |
|------|-----------|
| **Poll first** | 每个能力都能用普通 GET 轮询拿到。事件流（SSE）只是实时增强，**不是真相来源** |
| **Everything is resumable** | 提交是幂等的；任务状态与输出在 `expires_at` 之前都能按 ID 取回 |
| **Content-addressed assets** | 资产是 UUID 记录、blob 以服务端算出的 `blake3` 为键 —— 相同输入不会重复上传 |
| **Follow links, do not build URLs** | 响应里自带后续 URL，**照着走**，不要自己拼 |

### 输出 URL 的三种寿命：最容易踩的坑

「我的输出 URL」有三个**不同**的有效期，任何一个要把图展示给自己用户的程序都得同时考虑：

| 形态 | 从哪来 | 第三方能打开吗 | 多久失效 |
|------|--------|----------------|----------|
| **内容端点** `{base}/api/v2/assets/{id}/content` | job 的 `outputs` 里每一项的 `url` | ❌ 它是**需鉴权**的路由，没有你的 key 会返回 `401` | 稳定 —— 只要该资产还在就能解析 |
| **签名存储 URL** | `Asset` 响应里的 `url`、内容端点 `302` 跳转的 `Location`、SDK 的 `getDownloadUrl()` | ✅ 自带授权，浏览器或其他服务无需 key 即可读 | **短** —— Comfy Cloud 目前约 **6 小时** |

还有第三个数字，**它不是签名 URL 的过期时间**：

> `job` 的 `outputs` 里那个 `url_expires_at`，在 Comfy Cloud 上等于该 job 自己的 `expires_at`（即 `created_at` + 固定 30 天）。官方明确说明这**是个占位值** —— 背后还没有真实的保留与回收策略，**不要当承诺，也不要拿它做缓存依据**。

**结论：不要把签名 URL 存起来。** 它只活几小时：本地测试一切正常，等过期后你的用户就看不到图了。要长期展示，三选一：

1. **转存字节** —— 下载一次，复制进你自己的存储。多数应用最终都这么做
2. **按需重铸** —— 只持久化资产 `id`，渲染时现取新 URL（`GET /api/v2/assets/{id}`，或 SDK 的 `getDownloadUrl()`），拿到就立刻用
3. **由自己的后端代理** —— 后端拿着 key 取 `Output.url`，再把字节流给用户

**要读过期时间就读响应给的那个：** `Asset` 响应的 `url_expires_at` 才是同一响应里 `url` 的真实过期时间；`getDownloadUrl()` 会一起返回（TypeScript 里叫 `expiresAt`，Python 里叫 `expires_at`）。

> 💡 **自托管（走代理）没有签名 URL。** 代理直接从内容端点给字节，普通认证照旧，SDK 报告的过期时间是 `null`（Python `None`）。

### 队列管理为什么不在 v2

Comfy Cloud 自己的额度、模型浏览、**队列管理**等功能在 **v1 云 API**（[`/api-reference/cloud/`](https://docs.comfy.org/development/cloud/overview)）上，**不在 v2**。v2 只管「上传输入 → 提交工作流 → 观察执行 → 取回结果」这条主干。

### Comfy Router（另一件事，且尚未 GA）

v2 跑的是**你的工作流**。如果要**直接调合作方模型**（Flux、Veo、Gemini、Kling 等，一次请求对应模型自己的输入输出格式），那是 [Comfy Router](https://docs.comfy.org/development/comfy-router/quickstart)，接口在 `https://api.comfy.org`。**阅读前先看官方列的 [Router 限制](https://docs.comfy.org/development/comfy-router/limitations) —— 它还没正式可用。**

---

## A8.4 官方 SDK 速查

SDK 是把 v2 包成 Python / TypeScript 的官方客户端。**多数人应该从这里开始**，而不是直接手写 HTTP。

### 安装

```bash
pip install comfy-sdk          # Python 3.10 或更高
npm install @comfyorg/sdk     # Node.js 22 或更高
```

两个包**同版本发布**，当前为 `0.4.0`。建议装最新、或写一个范围而不是写死（Python `comfy-sdk>=0.4`；npm 的 `^0.4` 只到 `0.4.x`，想跟着后续小版本走要用 `@comfyorg/sdk@>=0.4.0`）。

### 「一个包，两个面」：抄示例前先看清是哪个客户端

同一个包里有**两个连不同服务的客户端**，而且**方法名故意长得像**（`run`、`submit`、`events` 都有），含义却不同：

| 面 | 做什么 | 怎么拿到 | Base URL | 认证 |
|----|--------|----------|----------|------|
| **Comfy Router** | 调合作方模型，用该模型自己的请求体，回原生的响应 | Python：`Comfy()` 上的 `client.models`；TypeScript：模块级 `comfy` 命名空间上的 `comfy.models` | `https://api.comfy.org` | `COMFY_API_KEY` |
| **Comfy Cloud / Comfy API v2** | 跑一份 API 格式工作流：传资产、交图、跟任务、下输出 | `Comfy(api_key=...)` / `new Comfy({ apiKey })`，然后用 `client.workflows` / `client.assets` / `client.jobs` | 默认 `https://cloud.comfy.org`，或由 `COMFY_BASE_URL` 指定 | 构造函数上的 `api_key` / `apiKey` |

两个面的写法分歧（官方原文如此）：

- **Python**：一个 `Comfy()` 同时带两个面 —— `client.models.run(...)` 是 Router，`client.workflows` / `client.assets` / `client.jobs` 是 Cloud
- **TypeScript**：是两个分开的导出 —— `comfy`（小写，模块级命名空间，含 `comfy.models`）与 `Comfy`（类，Cloud 客户端，**没有** `.models`）

两面**互不包装**，但**一把 API key 两边通用**。

> 💡 **SDK 是「从外部驱动 ComfyUI」。** 写自定义节点、写前端扩展（在 ComfyUI **内部**运行）是另一套 API，见 [`/custom-nodes/overview`](https://docs.comfy.org/custom-nodes/overview)。

### 换运行面：靠环境变量，不是构造参数

```bash
export COMFY_BASE_URL="https://<deployment>.run.comfy.app"  # Comfy API 部署
export COMFY_BASE_URL="http://127.0.0.1:8189"               # 自托管（经代理）
```

- 它是**环境变量**，每次构造客户端时读取；必须是 `http(s)` URL；**未设或为空 = Comfy Cloud**
- 所以客户端代码在哪都一样：`client = Comfy(api_key="comfyui-...")`
- 从早期版本升级：原来的 `Comfy("<url>", "<key>")` 已改为「`COMFY_BASE_URL` + `Comfy(api_key="<key>")`」；`api_key` 是**仅关键字**参数，旧的位置传参会直接报 `TypeError`（官方有意如此，免得把 URL 当 key 静默用掉）

### 最小示例

```python
from comfy_sdk import Comfy

# Comfy Cloud（自托管时设好 COMFY_BASE_URL 并去掉 key）
client = Comfy(api_key="comfyui-...")

wf = client.workflows.from_file("workflow_api.json")

asset = client.assets.from_file("photo.png")
wf.set_input("10", "image", asset)

job = client.run(wf)
for output in job.get_outputs("9"):
    output.to_file(output.name)
```

四个要点：

- `workflow_api.json` 是 **API 格式**的工作流（怎么导出见 [5.4.2](../5-自动化与批量生成/5.4-API调用.md)）
- `"10"` 与 `"9"` 是那份文件里的**节点 ID**：一个是输入图喂进去的节点，一个是要取结果的那个输出节点 —— 这份 ID 映射就是 [8.5.2](../8-与其他工具集成/8.5-与内部系统对接.md) 网关要藏在内部的同一份东西
- 资产句柄是**惰性**的：`photo.png` 先在本地算哈希，服务端已有这些字节就不再上传。**同样的输入重跑一次不花上传成本**
- `run()` = 提交**并等**到终态；要边跑边做别的事，用 `submit()` 配合事件流

### 跟着任务跑：事件流

```python
from comfy_sdk import Progress, Preview, OutputReady, StatusChange

job = client.submit(wf)

for event in job.events():
    match event:
        case Progress() as p:
            print(f"{p.value:.0%} {p.message}")
        case Preview() as pv:
            image = pv.to_pil()
        case OutputReady() as o:
            o.output.to_file(f"partial/{o.output.name}")
        case StatusChange(status="succeeded"):
            break

result = job.result()
```

这是 [5.4.4](../5-自动化与批量生成/5.4-API调用.md) 里手写 WebSocket 那段的官方替代品 —— SDK 会在连接断开后自己重连。`Preview.to_pil()` 需要额外装 Pillow（`pip install "comfy-sdk[pil]"`）；`result()` 在失败时抛 `JobFailed`，带上节点级细节。

### 目前覆盖到什么程度

**有：**

| 能力 | 说明 |
|------|------|
| 资产 | 从文件、字节、流或 URL 建输入句柄；内容寻址，重跑不重传 |
| 提交 | 交 API 格式图；**幂等**，队列满会在有界预算内自动重试 |
| 执行 | `wait()` 轮询，或 `events()` 跟实时进度 |
| 输出 | 写盘、进内存、取字节区间、取短期下载 URL |
| 可追溯 | 每个输出带着产出它的 job id，job 能交回它背后那份工作流 |
| 删资产 | 按句柄或 id 删除上传过的资产 |
| 错误 | 类型化异常：`JobFailed` / `Unauthorized` / `InsufficientCredits` / `QueueFull`，而不是裸状态码 |
| 取消 | 运行中的任务可取消；TypeScript 额外在任何调用上接受 `AbortSignal` |

Python 同时提供同步的 `Comfy` 与 `AsyncComfy`（同一套接口）；TypeScript **只有异步**。

**这一版没有：** 管理「已保存的工作流」、模型库、节点内省、命名工作流参数。（官方说明了为什么第一版范围这么小 —— 见其 Design Notes。）

### 自托管：`comfy-api-proxy`

Beta 期间，开源 ComfyUI 是靠一个**旁挂的小服务**来说 v2 的：

```bash
pip install comfy-api-proxy
comfy-api-proxy
```

默认把 `127.0.0.1:8188` 上的 ComfyUI 代理出来，在 **`127.0.0.1:8189`** 上提供 v2 API，**只绑 loopback**。认证默认关闭，可选配一个静态 bearer token（细节见 [`/development/comfyui-server/api-proxy`](https://docs.comfy.org/development/comfyui-server/api-proxy)）。

> ⚠️ **它是过渡方案。** v2 稳定后这套 API 会并进 ComfyUI 核心，代理就不需要了。**因此不要把「8189」当长期架构写进设计文档。**

---

## A8.5 Comfy CLI 与 Agent 工具（知道有这回事就够）

本站主线不依赖它们，但它们确实是官方在推的两条路，遇到时不必从零搜索。

### `comfy` 命令行工具（[官方页](https://docs.comfy.org/comfy-cli)）

```bash
comfy install                          # 装 ComfyUI（先建好 Python 虚拟环境）
comfy launch                           # 启动（--background 后台跑，comfy stop 停）
comfy cloud login                      # 浏览器 OAuth 登录 Comfy Cloud
comfy generate flux-pro --prompt "a cat on the moon" --download cat.png
```

- `comfy cloud login` 是**推荐**路径（浏览器 OAuth + PKCE，不用管 key，令牌约 1 小时并由 CLI 自动刷新）；**无浏览器的 CI 场景**才用 API key（`COMFY_API_KEY` 或 `--api-key`）
- `comfy generate` 直接调合作方模型，**是 beta**：同一件事 `flux-ultra` 用 `--width/--height`，`seedance` 用 `--ratio/--resolution/--duration`，**脚本化前先用 `comfy generate schema <模型>` 查它真实接受的参数**
- 上传的参考素材（`comfy generate upload` 得到的签名 URL）**24 小时后自动删除**，长跑流水线要每次重传

### Agent 工具（[MCP](https://docs.comfy.org/agent-tools/mcp) / [Skills](https://docs.comfy.org/agent-tools/skills)）

官方提供让 AI Agent 直接操作 ComfyUI 的 MCP 服务与 Skills。**这属于「用别人的智能体操作你的工作流」**，与 [8.5](../8-与其他工具集成/8.5-与内部系统对接.md) 讲的方向相反 —— 8.5 是你的服务被别人调，这里是你的 ComfyUI 被 Agent 调。两者不冲突。

---

## A8.6 从内置 API 迁移到 v2：概念怎么对应

如果你已经有 [5.4](../5-自动化与批量生成/5.4-API调用.md) 那套脚本，换到 v2 时对应关系如下（**细节以官方页面为准**）：

| 你要做的事 | 内置 API（v1） | Comfy API v2 / SDK |
|------------|----------------|---------------------|
| 提交工作流 | `POST /prompt`（附 `client_id`） | 提交 job（`client.submit(wf)`） |
| 任务标识 | `prompt_id` | job 的 `id` |
| 查状态 | `GET /history/{prompt_id}` | 查 job（`client.jobs...` / `job.wait()`） |
| 取输出 | `GET /view?filename=...` | 资产内容端点，或签名 URL（**注意 6 小时**，见 A8.3） |
| 跟进度 | WebSocket `/ws` | 事件流（SDK 里是 `job.events()`） |
| 取消任务 | `POST /interrupt` | job 可取消 |
| 队列 | `GET /queue` | **不在 v2**（v1 云 API 才有） |
| 鉴权 | 无 | `Authorization: Bearer <api-key>` |

> 💡 **迁移真正省下的是两件事**：① 不用自己写「提交 → 轮询 → 下载」的胶水，SDK 已经做了幂等重试与断线重连；② 输出 URL 的寿命问题从「你得自己想」变成「官方明文写清楚」（A8.3 那节）。**没省的是**：节点 ID 与工作流的绑定仍然要你自己维护 —— 那就是 [8.5.2](../8-与其他工具集成/8.5-与内部系统对接.md) 网关的职责。

---

## 相关资源

- **官方文档总入口：** https://docs.comfy.org/
- **中文文档：** https://docs.comfy.org/zh/
- **Comfy API v2 总览：** https://docs.comfy.org/api-reference/v2/overview
- **官方 SDK：** https://docs.comfy.org/development/api-development/sdks
- **启动参数（官方）：** https://docs.comfy.org/development/comfyui-server/startup-flags
- **故障排查（官方）：** https://docs.comfy.org/troubleshooting/overview
- **Comfy CLI：** https://docs.comfy.org/comfy-cli
- **comfy-api-proxy 仓库：** https://github.com/Comfy-Org/comfy-api-proxy
- **API key 管理：** https://platform.comfy.org/profile/api-keys
