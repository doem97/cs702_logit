# Phase 2 Video Script — Log-it Prototype Demo

**Target duration:** 2 min 10 sec – 2 min 20 sec  
**Format:** 直接录屏 + 旁白，不需要剪辑或 title page  
**录制前准备：** 刷新页面确保 Log Panel 为空；隐藏浏览器书签栏；窗口 1920×1080，浏览器 zoom 100%

---

## Segment 1 — Opening (0:00 – 0:08)

**[操作：打开 prototype 页面，确保页面顶部 header 和右侧空的 Log Panel 都完整可见]**

"Hi, we're Zichen, Huihui, and Ni. Our project reproduces Log-it, published at CHI 2023 by Jiang, Sun, and Xia."

---

## Segment 2 — Problem & Solution (0:08 – 0:25)

**[操作：鼠标指一下页面描述文字区域即可，不需要打开 DevTools]**

"Console.log is the most common debugging tool for web developers, but the output is just a wall of plain text — hard to locate, hard to compare across entries, and hard to understand. Log-it replaces it with interactive, color-coded Streams. Let me show you."

---

## Segment 3 — Demo 1: Stream Architecture + Slider (0:25 – 0:55)

**[操作：滚动到 Section 1 "Nested Loop Tracking"，点击 "Run Nested Loop"，等待 log 生成完毕]**

"We run a nested loop tracking variables i, j, and their product. Two streams appear on the right — 'Nested Loop' in blue and 'Products' in red, each with a name, entry count, and a menu."

**[操作：在 "Nested Loop" stream 菜单里点 Slider 切换到滑块视图，慢慢从左拖到右]**

"Switching to slider view, we step through entries one at a time. Changed values are highlighted in yellow — you can clearly see how i and j evolve across iterations."

---

## Segment 4 — Demo 2: Element Attachment (0:55 – 1:15)

**[操作：滚动到 Section 2 "Element Position & Size Debug"，点击 "Log Element Info"]**

"Log-it can attach a stream to a page element. Here the stream floats right next to the target."

**[操作：点击 "Resize & Log" 两次，观察 attached stream 里 width/height 更新]**

"Resizing and logging again — the values update in place, keeping the log visually connected to the element."

---

## Segment 5 — Demo 3: Color Coding + Filter (1:15 – 1:40)

**[操作：滚动到 Section 3 "Locating Logs in Cluttered Output"，点击 "Generate Cluttered Logs"，等生成完]**

"Now we generate fifteen logs across five categories — each gets its own color-coded stream."

**[操作：折叠两三个 stream，然后在 Log Panel 顶部的 filter 输入框输入 "warn"]**

"Collapsing irrelevant streams and filtering for 'warn' narrows it down instantly."

---

## Segment 6 — Demo 4: Property Highlighting + Sync (1:40 – 2:05)

**[操作：清除 filter。滚动到 Section 4 "Object Exploration"，点击 "Log Complex Object" 三次]**

"Next we log a complex nested object three times."

**[操作：在任意一个 entry 里点击展开 "user" 这个 key，观察所有 entry 同时展开]**

"Expanding a key in one entry expands it across all entries — that's synchronized interaction."

**[操作：双击 user > stats 下的 "loginCount" 这个 key]**

"Double-clicking a key like loginCount highlights that property across every entry, so we can compare a single field without the clutter."

---

## Segment 7 — Wrap-up (2:05 – 2:15)

**[操作：滚动回页面顶部]**

"To recap: our prototype covers stream-based log organization, in-place sliding, element attachment, color-coded filtering, and property highlighting with synchronized interaction. All data is live."

"Next we plan to add bar chart visualization, multi-property collection, LLM-powered log insight, a timeline sparkline, and a user study. Thanks for watching."

**[操作：保持画面 2-3 秒，结束录制]**

---

## 录制建议

- **分辨率：** 1920×1080，浏览器 zoom 100%
- **鼠标：** 操作要稳，点击前在按钮上略停顿
- **节奏：** 不要赶，后期可剪停顿
- **练习：** 录之前走一遍全流程
