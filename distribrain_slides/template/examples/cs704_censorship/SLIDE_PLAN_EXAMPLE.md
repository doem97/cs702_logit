# SLIDE_PLAN.md — CS704 Internet Censorship 案例

> 此文件为实际制作案例的参考。展示最终完成状态下 SLIDE_PLAN.md 应该是什么样的。

---

## Part 1: 设计规范

### 配色方案

```
主色 (PRIMARY):    #F59E0B (amber)  — 核心洞察、强调
辅色 (SECONDARY):  #22D3EE (cyan)   — 防御方/协议/evasion
第三色 (TERTIARY): #EF4444 (red)    — 审查方/detection/failure
背景:              #080808
文字:              #F0F0F0
```

语义映射: Red = 审查者(检测), Cyan = 防御者(规避), Amber = 关键洞察

### 动效规范

- 标题页/结束页: ParticleBackground 粒子网络 + TypewriterText
- 内容页: fadeUp stagger + CardDark 卡片
- 数据页: GSAP SVG 绘制（图表、流程图）
- 全局: 水平滑入过渡

---

## Part 2: Slides (20 页)

### Slide 00 — Title

**讲稿文本:**
> 大家好，欢迎来到这次关于互联网审查中机器学习应用的讨论...

**视觉设计描述:**
> 全屏暗色背景 + 粒子网络动画（红/青/琥珀三色粒子互联）。
> 主标题 "Detecting & Evading Internet Censorship" 使用打字机效果逐字显示，
> 红→橙→琥珀渐变色。完成后淡入副标题 "Three Perspectives on the Arms Race"。
> 水平分割线从中心向两侧展开。底部 "→ to continue" 脉冲提示。

### Slide 01 — Three Papers, One Story

**讲稿文本:**
> 今天我们要看三篇论文，分别从三个不同的角度...

**视觉设计描述:**
> 三张卡片等宽横排，stagger 从下方浮入（0.25s 间隔）。
> 每张卡片顶部有对应颜色的 3px 边框（红/琥珀/青）和微光底影。
> 卡片包含: 标签（Paper 1/Geneva/Paper 2）、会议名、论文标题、一行描述。
> 底部: 三色圆点 + 箭头连接线 "Detection → Evasion → Counter-Detection"。

<!-- ... 其余 slides 类似格式 ... -->
