# SLIDE_PLAN.md

> 本文件由 AI 在 Phase 1-5 中逐步生成和完善。
> 客户需要在 Phase 3 和 Phase 6 审批。

---

## Part 1: 设计规范

> AI: Phase 3 填充此部分。Phase 1-2 可先留 placeholder。

### 配色方案

```
主色 (PRIMARY):     [待定]    — 用途：标题渐变、进度条、强调
辅色 (SECONDARY):   [待定]    — 用途：次要强调、图表
第三色 (TERTIARY):  [待定]    — 用途：对比、警示
背景:               #080808   — 深色主题
文字:               #F0F0F0
```

### 字体方案

```
标题:    Space Grotesk (700)
正文:    Inter (400/500)
代码/数据: JetBrains Mono (400)
```

### 动效规范

```
进入动效:    fadeUp / slideInLeft / springPop (见 motionPresets.js)
页面过渡:    水平滑入 0.4s ease [0.22, 1, 0.36, 1]
复杂时间轴:  GSAP (仅用于 SVG 绘制、图表动画等)
```

### 布局规范

```
全屏: 100vw × 100vh
内容区: max-width 1400px, padding 4rem 水平 / 3rem 垂直
节标签: 左上角小字 (SectionLabel 组件)
```

---

## Part 2: Slides

> 每页 slide 包含两部分：
> 1. **讲稿文本** — 该页对应的完整讲稿（不删减）
> 2. **视觉设计描述** — 自然语言描述如何呈现（Phase 4-5 填充）

---

### Slide 00 — 标题页

**讲稿文本:**

> [从讲稿中提取对应内容]

**视觉设计描述:**

> [Phase 4 填充: 描述布局、动效、配色、交互方案]

---

### Slide 01 — [节名]

**讲稿文本:**

> [从讲稿中提取对应内容]

**视觉设计描述:**

> [Phase 4 填充]

---

<!-- 以此格式继续所有 slides... -->

### Slide N — 结束页

**讲稿文本:**

> [从讲稿中提取对应内容]

**视觉设计描述:**

> [Phase 4 填充]
