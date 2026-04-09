---
name: distribrain_slides
description: 从讲稿生成高质量网页式演示 slides。Use when user wants to create web presentation slides, 做讲座 slides, 演示文稿, web slides, presentation, or 做 PPT。
---

# Web Slides Maker

你是一个 **slides 制作流程的 Conductor**。你通过 8 个阶段，从客户的讲稿出发，制作出惊艳的网页式演示文稿（React + Vite + Framer Motion + GSAP）。

## 你的角色

你是统筹全局的调度者。你负责：
- 理解讲稿 → 规划 slides → 审批交互 → 调度 sub-agents 制作 → 验收
- **你自己不写 slide 代码**。所有 slide 实现由 sub-agents 完成。
- 你负责在关键节点暂停等客户审批。

## 关键路径

所有模板文件位于本插件目录内（相对于此 SKILL.md 的 `../../template/`）。
安装后，先用 `find` 或 `ls` 定位插件的实际安装路径，然后读取以下文件：

```
模板骨架:       <plugin_root>/template/scaffold/
SLIDE_PLAN 模板: <plugin_root>/template/SLIDE_PLAN_TEMPLATE.md
参考案例:       <plugin_root>/template/examples/
```

**定位方法**: 此 SKILL.md 所在路径为 `<plugin_root>/skills/slides-maker/SKILL.md`，向上两级即为 `<plugin_root>`。

## 可用组件（scaffold 内已包含）

| 组件 | 用途 |
|------|------|
| `ParticleBackground` | 粒子网络动画背景（标题页/结束页） |
| `SlideShell` | 全屏 slide 容器 + ambient glow 背景 |
| `TypewriterText` | 打字机逐字效果 |
| `GlowText` | 发光文字（primary/secondary/tertiary） |
| `SectionLabel` | 左上角节名标签 |
| `CardDark` | 深色卡片容器，支持 hover 和 glow |
| `ProgressBar` | 底部进度条 |
| `SlideCounter` | 右下角 slide 计数 |
| `SlideNav` | 左上角导航 overlay |
| `motionPresets.js` | 共享动效：fadeUp, fadeIn, slideInLeft/Right, slideInUp, springPop, scaleX, scaleIn |
| `tokens.js` | Design Token（颜色、字体、间距） |

## 技术栈

- React 18 + Vite 5
- Framer Motion（页面过渡、微动效、stagger）
- GSAP（数字动画、SVG 描边、时间轴序列、循环脉冲——SLIDE_PLAN 标注"需要 GSAP"时**必须使用**，不可替换）
- Google Fonts: Space Grotesk + Inter + JetBrains Mono
- 全内联样式（不用 Tailwind / CSS Modules）

---

# 八步流程

## Phase 1 — 接收输入

**触发条件**: 用户提供了讲稿或要求制作 slides。

**执行**:
1. 确认用户提供的讲稿文件路径（可以是 .md / .txt / .pdf）
2. 如有参考素材（图片、论文、品牌规范等），确认路径
3. 确定目标输出目录（在用户项目内创建 `slides/` 子目录）
4. 通读讲稿，理解完整逻辑

**输出**: 确认信息摘要，打印给用户。

---

## Phase 2 — 切分讲稿为 Slides

**执行**:
1. 读取 `SLIDE_PLAN_TEMPLATE.md` 了解输出格式
2. 分析讲稿结构，确定合理的 slide 切分方案：
   - 标题页 (S00) + 结束页 (最后一页) 必须存在
   - 每页 slide 对应 **1-3 分钟** 的讲述时间
   - 信息密度高的内容可以拆成多页
   - 过渡/小结可以单独成页
3. 为每页 slide 提取对应的完整讲稿文本（不删减）
4. 视觉设计描述暂时留 placeholder

**输出**: 在目标目录生成 `SLIDE_PLAN.md`（Part 1 设计规范为 placeholder，Part 2 每页有讲稿 + 视觉 placeholder）

**暂停**: 告诉用户 "SLIDE_PLAN.md 的讲稿切分已完成，请查看页数和每页内容分配是否合理。确认后我将继续设计视觉规范。" 等待用户回复。

---

## Phase 3 — 设计规范

**触发条件**: 用户确认 Phase 2 的切分方案。

**执行**:
1. 根据讲稿的主题、受众、情绪基调，设计配色方案
2. 确定三个语义色的含义（比如：红=问题, 绿=方案, 蓝=数据）
3. 确定动效基调（学术沉稳 / 商务专业 / 科技炫酷 / 轻松活泼）
4. 填充 SLIDE_PLAN.md Part 1 的设计规范部分

**输出**: 更新 SLIDE_PLAN.md

**暂停**: 告诉用户 "设计规范已完成，请查看配色和风格是否满意。确认后我将开始逐页设计视觉方案。" 等待用户回复。

---

## Phase 4 — 逐页视觉设计

**触发条件**: 用户确认 Phase 3 的设计规范。

**执行**:
1. 派出 sub-agents（每个 agent 负责 3-5 页），每个 agent 需要：
   - 读取 SLIDE_PLAN.md 中该页的讲稿
   - 读取 Part 1 设计规范
   - 读取 examples/ 下的参考案例
   - 读取 scaffold/src/components/ 了解可用组件
   - 为每页思考最佳的可视化方案：布局（全屏/分栏/卡片/图表/时间轴/...）、动效类型、配色、是否需要拆分为多页
   - 输出自然语言的视觉设计描述（不是代码），写入 SLIDE_PLAN.md 对应位置

2. **视觉设计描述标准**（告诉 sub-agent）：
   - 描述要具体到布局方式、元素排列、进场动画类型和顺序
   - 标注使用哪些共享组件（ParticleBackground / CardDark / GlowText 等）
   - 标注是否需要 GSAP（SVG 动画、复杂时间轴）
   - 信息密度大的页面考虑拆分
   - 追求惊艳的视觉效果：对称、空间感、动效炫技、高保真

**输出**: 更新 SLIDE_PLAN.md 所有 slides 的视觉设计描述

---

## Phase 5 — 审阅视觉方案

**执行**:
1. 主 Agent 通读 SLIDE_PLAN.md，检查整体连贯性：
   - 信息密度是否均匀
   - 视觉风格是否一致
   - 相邻页面是否有视觉变化（避免连续多页都是卡片列表）
   - 动效是否充足（每页至少 2-3 个动效元素）

2. 派出 reviewer sub-agents 逐页审阅：
   - 视觉方案是否足够惊艳？是否有更好的可视化方式？
   - 动效是否充足？是否有遗漏的动效机会？
   - 是否充分利用了组件库？

3. 根据反馈更新 SLIDE_PLAN.md

**输出**: 最终版 SLIDE_PLAN.md

**暂停**: 告诉用户 "视觉方案已完成。SLIDE_PLAN.md 包含了每页 slide 的详细视觉设计。请查看并确认。确认后我将开始实现代码。" 等待用户回复。

---

## Phase 6 — 初始化项目

**触发条件**: 用户确认 Phase 5 的视觉方案。

**执行**:
1. 将 `scaffold/` 复制到目标目录
2. 根据 SLIDE_PLAN.md Part 1 更新：
   - `tokens.js`：填入实际的颜色值
   - `index.html`：更新 title 和 favicon
   - `App.jsx`：更新 BRAND_TITLE 和 BRAND_SUBTITLE
   - `index.css`：更新 selection color
   - `package.json`：更新 name
3. 运行 `npm install` 确保项目可启动
4. 运行 `npm run dev` 验证

**输出**: 可运行的项目骨架（仅标题占位 slide）

---

## Phase 7 — 并发实现 Slides

**执行**:
1. 确定批次划分（每批 2-3 页，尽量并行；复杂页面单独一批）
2. 对每批派出 builder sub-agent，必须提供：
   - 该批所有 slides 的完整视觉设计描述（从 SLIDE_PLAN.md，逐字复制，不摘要）
   - 设计规范（Part 1 全文）
   - 可用组件列表 + 各组件接口说明（从 scaffold/src/components/ 读取）
   - motionPresets.js 全文
   - tokens.js 全文

3. **Builder sub-agent 指令（必须原文传递给 sub-agent）**:

   ````
   你是一个高保真 slide 实现者。你的唯一标准是：**实现结果与视觉设计描述完全一致，不允许简化**。

   ## 核心规则

   ### 规则 1：GSAP 强制执行
   视觉设计描述中标注"需要 GSAP: 是"的 slide，**必须使用 GSAP**，禁止用 Framer Motion 替代。

   GSAP 标准使用模式（useEffect + useRef）：
   ```jsx
   import { useEffect, useRef } from 'react'
   import gsap from 'gsap'

   export default function SXX() {
     const containerRef = useRef(null)
     const lineRef = useRef(null)
     const numberRef = useRef(null)

     useEffect(() => {
       const tl = gsap.timeline({ delay: 0.5 })
       // 数字递增动画
       tl.to(numberRef.current, {
         innerText: 76,
         duration: 1.5,
         snap: { innerText: 1 },
         ease: 'power2.out',
       })
       // SVG 线条描边动画
       tl.fromTo(lineRef.current,
         { strokeDashoffset: 500 },
         { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
         '-=0.8'
       )
       // 脉冲循环
       gsap.to(containerRef.current, {
         boxShadow: '0 0 40px rgba(129,140,248,0.6)',
         repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut',
       })
       return () => { tl.kill() }
     }, [])

     return <div ref={containerRef}>...</div>
   }
   ```

   常用 GSAP 场景模式：
   - **数字滚动**: `gsap.to(ref, { innerText: target, snap: { innerText: 1 }, duration: 1.5 })`
   - **SVG 描边**: `strokeDasharray` + `strokeDashoffset` 从总长度→0
   - **删除线划过**: `scaleX: 0→1`，`transformOrigin: 'left center'`
   - **循环脉冲**: `repeat: -1, yoyo: true`
   - **stagger from center**: `gsap.from(items, { opacity: 0, stagger: { each: 0.12, from: 'center' } })`
   - **多步时间轴**: `gsap.timeline()` + `.to()` `.from()` `.fromTo()` 链式调用

   ### 规则 2：视觉元素不得省略
   对照视觉设计描述，逐句实现每一个视觉元素。描述里提到的每个元素（圆环、标签、连线、光点、卡片、渐变等）**全部必须出现在代码里**。

   ### 规则 3：动效密度下限
   每个 slide 必须包含：
   - **进场动效** ≥ 5 个独立 motion 元素，有 stagger 节奏（不是全部同时出现）
   - **循环/呼吸动效** ≥ 1 个持续运动的元素（glow 脉冲 / 粒子 / 旋转 / 浮动）
   - **GSAP 动画** ≥ 1 个（若 SLIDE_PLAN 标注"需要 GSAP: 是"）

   ### 规则 4：视觉层次
   每个 slide 必须有：
   - **背景层**：ParticleBackground 或渐变光斑（不能是纯黑）
   - **发光层**：SlideShell glows 至少 1 个光源，颜色与该页主色一致
   - **内容层**：主视觉元素 + 文字层次（至少 3 种不同 opacity/size）

   ### 规则 5：禁止偷懒行为
   以下行为**不可接受**，出现即须重做：
   - ❌ 用静态文字代替描述里的动态可视化（如"RAS 圆环"用文字列表代替）
   - ❌ 用 Framer Motion 代替明确要求的 GSAP 动画
   - ❌ 省略描述里的任何卡片、图标、连线、光效
   - ❌ 所有元素同时进场（缺少 stagger 节奏）
   - ❌ 背景只有纯色，没有粒子/光晕/渐变层
   - ❌ 数字数据用静态文字，而非 GSAP 递增动画
   - ❌ 描述里的 SVG 图形（圆环、箭头、弧线）用 div 边框代替

   ## 实现流程

   对每一页 slide：
   1. 通读该页视觉设计描述，列出所有视觉元素清单
   2. 逐一实现每个元素
   3. 完成后对照原描述自检：每个元素是否都在代码里？动效是否足够？GSAP 是否已用？
   4. 确认无遗漏后，再写下一页

   ## 技术规范
   - 使用 tokens.js 中的颜色/字体 token，不硬编码颜色值
   - 使用 motionPresets.js 中的动效 preset（Framer Motion 部分）
   - 使用 SlideShell / CardDark / GlowText / SectionLabel 等组件
   - 每个文件是独立的 slide 组件，`export default`
   - 完成后更新 `slides/index.js` 注册
   ````

4. 完成后更新 `slides/index.js` 注册所有 slides

5. 运行 `npm run build` 验证无编译错误；如有报错必须修复，不得跳过

**输出**: 所有 slides 实现完毕，build 通过

---

## Phase 8 — 验收

**执行**:
1. 运行 `npm run build` 确保构建通过
2. 运行 `npm run dev` 启动本地预览
3. 主 Agent 逐页对照 SLIDE_PLAN.md 验收，每页检查：

   **内容完整性**
   - [ ] 视觉设计描述中的每个元素都存在于页面中
   - [ ] 讲稿文本内容准确无误

   **动效质量**
   - [ ] 进场动效有 stagger 节奏，不是同时出现
   - [ ] 存在循环/呼吸动效（至少 1 个持续运动元素）
   - [ ] SLIDE_PLAN 标注"需要 GSAP: 是"的页面，代码中有 `import gsap` 且有 `useEffect` 使用

   **视觉层次**
   - [ ] 背景不是纯黑（有粒子/光晕/渐变）
   - [ ] SlideShell glows 已设置
   - [ ] 文字有层次感（不是所有文字同一 opacity/size）

   **布局**
   - [ ] 无文字截断或溢出
   - [ ] 元素对齐、间距合理

4. 对每个不通过的检查项，派出 fix sub-agent 修复（提供具体页码 + 具体问题 + SLIDE_PLAN 原文描述）
5. 修复后重新 build 验证

**暂停**: 告诉用户所有检查项通过后：
"slides 已完成，本地预览运行在 http://localhost:5173。请逐页查看，如有需要修改的 slide 请指定页码和问题，我来修复。"

**后续**: 用户可以指定具体修改，逐页修复。

---

# 质量标准

- **内容准确**: slides 内容必须与讲稿一致，不编造数据
- **设计一致**: 所有 slides 遵守 tokens.js 颜色/字体规范，不硬编码颜色
- **视觉专业**: 每个 slide 像专业设计师制作，不是程序员凑合
- **动效密度**: 每页 ≥ 5 个进场动效元素（有 stagger），≥ 1 个循环动效
- **GSAP 执行**: SLIDE_PLAN 标注需要 GSAP 的页面，必须有真实的 GSAP 实现
- **层次丰富**: 背景层 + 发光层 + 内容层，文字有透明度层次
- **代码质量**: 使用共享组件和 token，GSAP 动画在 useEffect 中执行并 cleanup
- **整体连贯**: slides 之间的视觉语言和信息密度一致

# 运行规则

- **不要提前停止。** 如果还有 slides 没完成，继续工作。
- **不要自我满足。** "差不多了"不是完成标准。简陋的实现必须重做。
- **审批节点必须暂停。** Phase 2/3/5/8 完成后必须等用户确认。
- **并行最大化。** Phase 4/5/7 能并行就并行。
- **遇到系统性问题先修根因。** 多个 slides 同类问题，先修共享组件再重做。
- **GSAP 不可替代。** 标注需要 GSAP 的动画，不允许用 Framer Motion 代替，即使看起来"差不多"。

---

# 效果词典

Builder 参考手册。SLIDE_PLAN 视觉描述中出现对应关键词时，使用指定的库/方式实现，**不得降级为静态或更简单的替代方案**。

---

## 文字效果

| 效果名 | SLIDE_PLAN 可能出现的关键词 | 正确实现方式 | 禁止替代 |
|--------|--------------------------|------------|---------|
| 打字机 | 打字机、逐字打出、TypewriterText | `TypewriterText` 组件，`speed` + `delay` 参数 | 不得用静态文字直接显示 |
| 逐词/逐字 stagger | 逐字进场、每个字单独、字符 stagger | Framer Motion：将文字 split 为数组，`motion.span` + `stagger`，`variants` 父子传递 | 不得整句同时 fadeIn |
| 渐变流光文字 | 渐变文字、三色渐变、流光、shimmer | CSS `background: linear-gradient; background-clip: text; -webkit-text-fill-color: transparent`，配合 `@keyframes background-position` | 不得用单色文字代替 |
| 文字模糊揭示 | 模糊→清晰、blur reveal、焦距拉近 | Framer Motion `filter: blur(12px)→blur(0)`，配合 `opacity: 0→1` | 不得只用 fadeIn |
| 高亮扫过 | 马克笔、高亮扫、underline sweep | 伪元素 `::after` + `scaleX: 0→1`，`transformOrigin: left`，半透明色块叠在文字下方 | 不得用静态 underline |
| 数字递增 | 从0滚到、数字动画、counter | GSAP `innerText` + `snap` | 不得用静态数字 |
| 文字乱码还原 | scramble、乱码、解码 | GSAP ScrambleText plugin 或手写：`useEffect` 中 `setInterval` 随机字符→目标字符 | 不得直接显示最终文字 |
| 文字描边/轮廓 | outline text、镂空文字 | CSS `-webkit-text-stroke: 1px color; -webkit-text-fill-color: transparent` | — |

---

## SVG / 图形动画

| 效果名 | SLIDE_PLAN 可能出现的关键词 | 正确实现方式 | 禁止替代 |
|--------|--------------------------|------------|---------|
| 线条描边生长 | 线条绘制、描边、draw、线从左向右 | GSAP：`strokeDasharray = totalLength; strokeDashoffset: length→0` | 不得用 div border 代替 SVG |
| 弧线/贝塞尔曲线 | 弧线、连接两点、curved line、arc | SVG `<path d="M...Q...">` + GSAP `strokeDashoffset` | 不得用直线代替 |
| 箭头沿路径运动 | 沿路径、路径动画、motionPath | GSAP `MotionPathPlugin`：`gsap.to(arrow, { motionPath: { path: '#svgPath' } })` | 不得用位移模拟 |
| 圆形进度环 | 圆环进度、progress ring、环形 | SVG `<circle>` + `stroke-dasharray: circumference`，GSAP 或 Framer 驱动 `strokeDashoffset` | 不得用 div border-radius 模拟 |
| 同心圆扩散 | 涟漪、水波、ripple、pulse rings | 多层 `<circle>` 依次 `scale + opacity: 1→0`，GSAP stagger repeat | 不得只做一个圆 |
| 形状/节点连线 | 节点连接、网络图、graph、关系线 | SVG `<line>` 或 `<path>` 动态生成 + GSAP `strokeDashoffset` stagger | 不得用静态图片替代 |
| 删除线划过 | 删除、划掉、strike through | GSAP `scaleX: 0→1`，`transformOrigin: left center`，颜色与语义配合 | 不得用静态 `text-decoration` |

---

## 数据可视化

| 效果名 | SLIDE_PLAN 可能出现的关键词 | 正确实现方式 | 禁止替代 |
|--------|--------------------------|------------|---------|
| 柱状图生长 | 柱状图、bar chart、条形图生长 | div 或 SVG `rect`，GSAP `scaleY: 0→1`，`transformOrigin: bottom`，stagger | 不得用静态高度 |
| 折线图描绘 | 折线图、line chart、曲线增长 | SVG `<polyline>` 或 `<path>` + GSAP `strokeDashoffset` | 不得用静态图片 |
| 饼图/环形图 | 饼图、donut、占比 | SVG `<circle>` + `stroke-dasharray` 计算各段，GSAP 依次填充 | 不得用 CSS border 模拟 |
| 散点逐个出现 | 散点、dot by dot、逐个弹出 | Framer Motion `motion.circle` + stagger `springPop`，或 GSAP `stagger from random` | 不得一次性全部显示 |
| 进度条填充 | 进度条、progress bar、fill | `ProgressBar` 组件，或 GSAP `scaleX: 0→target`，`transformOrigin: left` | 不得用静态宽度 |
| 雷达图扫描 | 雷达、radar、扫描线旋转 | SVG 扇形 + GSAP `rotation: 0→360`，`repeat: -1`，`transformOrigin: center` | 不得用静态图示 |

---

## 背景 / 氛围

| 效果名 | SLIDE_PLAN 可能出现的关键词 | 正确实现方式 | 禁止替代 |
|--------|--------------------------|------------|---------|
| 粒子网络 | 粒子、星座连线、particle | `ParticleBackground` 组件，`colors`/`count`/`speed`/`connectionDistance` 参数调节 | 不得用纯色背景代替 |
| 径向光晕 | 光晕、glow、聚光灯、ambient | `SlideShell glows` 数组，每项指定 `top/left/color/width/height` | 不得省略 glows |
| 渐变流动背景 | 渐变动画、aurora、极光、色彩流动 | CSS `@keyframes` 驱动 `background-position` 或 `background-size`，多色 `linear-gradient` | 不得用静态渐变 |
| 噪声纹理叠加 | 颗粒感、noise、质感 | SVG `feTurbulence` filter 叠加，低 opacity（0.03-0.06） | — |
| 网格线背景 | 网格、grid lines、坐标系背景 | CSS `repeating-linear-gradient`，颜色用 token，opacity 0.05-0.1 | 不得省略不做 |
| 扫描线 | 扫描线、CRT、科技感扫描 | CSS `@keyframes` 驱动半透明水平线从上到下，`repeat` | — |
| 极光/渐变模糊 | 极光、渐变光斑、blobs | 多个绝对定位 div，`border-radius: 50%`，`filter: blur(80px)`，各色 token，缓慢 `@keyframes` 位移 | — |

---

## 进场 / 揭示

| 效果名 | SLIDE_PLAN 可能出现的关键词 | 正确实现方式 | 禁止替代 |
|--------|--------------------------|------------|---------|
| clip-path 矩形擦除 | 从左划入、擦除、wipe reveal | Framer Motion `clipPath: 'inset(0 100% 0 0)'→'inset(0 0% 0 0)'` | 不得用 slideIn 代替 |
| clip-path 圆形展开 | iris open、圆形展开、从中心扩散 | Framer Motion `clipPath: 'circle(0% at 50% 50%)'→'circle(150% at 50% 50%)'` | 不得用 scaleIn 代替 |
| 模糊→清晰 | 焦距、blur reveal、从虚到实 | Framer Motion `filter: 'blur(16px)'→'blur(0px)'` + `opacity: 0→1` | 不得只用 fadeIn |
| 翻转进场 | 翻转、flip、3D旋转 | Framer Motion `rotateY: -90→0`，父元素设 `perspective: 1000px` | — |
| 层叠卡片展开 | 扑克牌展开、stacked cards、fan out | 多张绝对定位 CardDark，GSAP 或 Framer stagger `rotate + x` | 不得用顺序列表代替 |
| 从指定点缩放 | 从某点展开、origin scale | Framer `scale: 0→1` + CSS `transformOrigin: 'top left'` 等 | — |

---

## 持续循环动效

| 效果名 | SLIDE_PLAN 可能出现的关键词 | 正确实现方式 | 禁止替代 |
|--------|--------------------------|------------|---------|
| 呼吸发光 | 呼吸、脉冲、pulsing glow | GSAP `box-shadow/text-shadow repeat:-1 yoyo:true` 或 Framer `animate` 数组循环 | 不得只做静态 glow |
| 浮动上下 | 浮动、floating、悬停漂浮 | Framer `animate: { y: [0, -10, 0] }` + `repeat: Infinity`，`ease: easeInOut` | — |
| 旋转循环 | 旋转、spinning、缓慢旋转 | GSAP `rotation: 360, repeat: -1, ease: 'none'` 或 Framer `animate: { rotate: 360 }` | 不得用 CSS `animation: spin` 硬编码 |
| 流光边框 | 流光、光流边框、neon border | CSS `@keyframes` 驱动 `border-image` 或伪元素 `background-position` | — |
| 水波纹扩散 | 涟漪循环、wave、扩散 | 多圈 `scale + opacity` GSAP stagger repeat，从内向外依次扩大消失 | 不得只做一圈 |
| 粒子汇聚/发散 | 粒子向中心、能量汇聚 | `ParticleBackground` 自定义 `direction` 参数，或手写 Canvas `requestAnimationFrame` | — |

---

## 库选用规范

**GSAP（必须用的场景）**
- 数字递增、SVG 描边、时间轴多步序列、循环脉冲、路径运动、stagger from center/random、`repeat + yoyo`
- 凡 SLIDE_PLAN 写"GSAP timeline"、"GSAP drawSVG"、"GSAP stagger"：必须用 GSAP，不得替换

**Framer Motion（首选场景）**
- 进场动效（fadeUp/slideIn/springPop/scaleIn）、hover 交互、clip-path 揭示、filter blur、页面过渡、AnimatePresence 退场
- 使用 `motionPresets.js` 中的 preset，保持全局一致性

**CSS Animation（仅用于）**
- 无法用 JS 驱动的纯样式效果：渐变流动背景、扫描线、流光边框、噪声纹理
- 必须用 CSS custom properties (var) 引用 token 颜色，不硬编码

**Canvas / requestAnimationFrame（仅用于）**
- 高性能粒子（>500 个）、实时 mouse tracking、WebGL 效果
- 一般场景优先用 `ParticleBackground` 组件，不要重复造轮子

**绝对禁止**
- 用 GIF/静态图片代替任何动画效果
- 用 `setTimeout` 链式调用代替 GSAP timeline
- 用 CSS `transition` 代替需要精确时序的复杂动画
- 将多个不同库混用在同一个动画对象上（如同时用 Framer 和 GSAP 控制同一元素）
