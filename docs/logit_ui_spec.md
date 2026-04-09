# Log-it — Interactive Demo Page Specification

> **For Gemini Stitch**: This document describes the *content*, *functional requirements*, and *narrative structure* of an interactive demo page. You have **full creative freedom** on layout, visual style, interaction patterns, animations, and spatial arrangement. We describe *what* the user should see and experience — you decide *how* to present it.

---

## 1. Product Context

### What is Log-it?

Log-it is a research prototype from a CHI '23 paper. It replaces `console.log()` with a structured `log()` function that organizes program output into interactive **Streams** — color-coded, explorable, and visually rich.

The core problem it solves: traditional `console.log()` produces a flat wall of text with no structure, no interactivity, and no visual context. Log-it fixes this by giving each `log()` call a home in a named, colored stream with built-in data exploration tools.

### What this page needs to do

This is a **showcase / demo page** for an academic course project. It needs to:

1. Clearly communicate what Log-it does and why it matters
2. Let visitors interactively trigger log output and see the structured result
3. Progressively introduce features from basic to advanced
4. Make every feature discoverable — visitors should not have to guess that interactions exist

### Audience

Course instructors, classmates, and paper reviewers evaluating a reproduction of the original research. They are technically literate but have never seen Log-it before.

### Identity

- **Product name**: Log-it
- **Tagline**: "Interactive, Structured, and Visual Logs for Programming"
- **Academic context**: CHI '23 Reproduction — original paper by Jiang, Sun & Xia
- **Extensions built by us**: LLM-Powered Insight, Timeline Sparkline (these should be visually distinguished as "new" contributions)

---

## 2. Scenes (Progressive Narrative)

The page tells a story in 5 scenes, each building on the previous. Each scene has a **trigger** (something the user does), an **output** (log data that appears), and **featured capabilities** (what the scene demonstrates).

The cause-effect relationship between trigger and output must be visually clear — the user should never wonder "where did that output go?" or "which button produced this?"

### Scene 1: "Organized Streams" — log() replaces console.log()

**Story**: A nested loop runs, producing structured data. Instead of a wall of text, the output is organized into named, color-coded streams.

**Trigger**: A button labeled "Run Nested Loop" that executes a 3x4 nested loop, emitting one log entry every ~300ms.

**Output** (two streams appear):

| Stream | Color | Data per entry |
|--------|-------|----------------|
| "Nested Loop" | Blue | `{ i: 0, j: 2, product: 0, sum: 2, phase: "init" }` |
| "Products" | Red | A single number (e.g., `6`) |

12 entries total per stream, arriving one by one over ~3.6 seconds.

**Featured capabilities to demonstrate**:
- **Stream grouping**: Multiple `log()` calls are organized into named streams, not dumped into one list
- **Color coding**: Each stream has a distinct color for quick visual identification
- **List view**: Entries appear chronologically with index numbers and timestamps
- **Live updating**: Entries animate in as they arrive

---

### Scene 2: "Explore Your Data" — interactive object trees

**Story**: A complex nested object is logged. The user can expand/collapse branches, highlight a specific property to track it across multiple entries, and use a slider to step through entries one by one with change detection.

**Trigger**: A button labeled "Log Complex Object" — each click logs a new entry with randomized numeric values.

**Output** (one stream):

| Stream | Color | Data per entry |
|--------|-------|----------------|
| "User Data" | Pink | Deeply nested object (see below) |

```
{
  user: {
    id: 4821,
    profile: {
      name: "Alice",
      email: "alice@example.com",
      preferences: {
        theme: "dark",
        language: "en",
        notifications: { email: true, push: false, sms: true }
      }
    },
    stats: {
      loginCount: 47,
      lastActive: "2026-04-10T14:23:01.000Z",
      sessions: 3
    }
  },
  metadata: { version: "2.1.0", region: "us-west-2", timestamp: 1712765000000 }
}
```

**Featured capabilities to demonstrate**:
- **Object Explorer**: Nested objects are rendered as an expandable/collapsible tree
- **Property Highlighting**: The user can focus on a single property key (e.g., `user.stats.loginCount`), which filters the display to show only that path across all entries — making it easy to compare a specific value over time
- **Synchronized Interaction**: Expanding/collapsing a branch in one entry applies to all entries in the stream
- **In-Place Sliding**: Switch from list view to slider view — a scrubber shows one entry at a time, with changed values visually marked compared to the previous entry

---

### Scene 3: "Contextual Logging" — logs attached to UI elements

**Story**: A page element (a box) is being debugged. Instead of sending logs to a separate panel, the log output appears physically next to the element itself.

**Trigger area**: A resizable rectangular box labeled "Target Element" on the page, plus two buttons:
- "Log Element Info" — captures the element's current bounding box
- "Resize & Log" — randomly changes the box's dimensions, then logs the new bounds

**Output** (one stream, spatially attached to the target element):

| Stream | Color | Data per entry |
|--------|-------|----------------|
| "Element Info" | Green | `{ tagName: "DIV", id: "debug-target", x: 120, y: 340, width: 180, height: 95, top: 340, left: 120, visible: true }` |

**Key spatial requirement**: This stream's output must appear **near/adjacent to the target element**, not in a separate panel. If the element moves (resize, scroll), the log output follows it. This is the "Element Attachment" feature.

**Featured capabilities to demonstrate**:
- **Element Attachment**: Log output is spatially tied to a DOM element, providing in-context debugging
- **Property Highlighting**: Double-click a property key (e.g., `width`) to track its value across entries

---

### Scene 4: "Taming the Chaos" — filtering and managing many streams

**Story**: A realistic scenario where many different types of logs fire simultaneously. The user needs to find and focus on specific information in the noise.

**Trigger**: A button labeled "Generate Cluttered Logs" that produces 15 log entries across 5 different streams, interleaved over ~3 seconds.

**Output** (five streams, all appearing in the same log panel):

| Stream | Color | Data type |
|--------|-------|-----------|
| "Info" | Gray | Simple text: `"App initialized module #3"` |
| "Warnings" | Orange | Object: `{ level: "warn", message: "Slow query detected: 86ms", query: "SELECT * FROM table_5" }` |
| "User Events" | Purple | Object: `{ userId: 1003, action: "scroll", timestamp: 1712765000, duration: 142.7 }` |
| "Metrics" | Cyan | Single number: `150.2` |
| "Service Status" | Green | Object: `{ service: "api", status: "healthy", latency: 45.3, connections: 12 }` |

**Featured capabilities to demonstrate**:
- **Filtering**: A text search that narrows the stream list by name
- **Collapse/Unfold**: Hide a stream's body to reduce noise, while keeping the header visible
- **Pause/Resume**: Freeze a stream to stop new entries from arriving
- **Delete**: Remove a paused stream entirely
- **Color coding at scale**: With 5+ streams, color becomes the primary way to quickly identify which stream is which

---

### Scene 5: "AI-Powered Extensions" — beyond the original paper

**Story**: Real-time data is being tracked. New extensions add temporal visualization and AI-powered analysis.

**Trigger area**: A rectangular tracking zone on the page, plus a toggle button "Start/Stop Tracking". When active, mouse movement inside the zone generates log entries at ~10fps.

**Output** (one stream):

| Stream | Color | Data per entry |
|--------|-------|----------------|
| "Mouse Position" | Yellow | `{ x: 142, y: 67, clientX: 580, clientY: 312 }` |

**Featured capabilities to demonstrate**:

- **Timeline Sparkline** (Extension — our contribution): A miniature timeline visualization below the stream header. Horizontal axis = time, each dot = a log event. For numeric streams, renders as a line chart showing value trends.
- **Bar Chart View** (for numeric streams): Switch from list/slider to a horizontal bar chart where each entry's numeric value is a bar.
- **LLM Insight** (Extension — our contribution): An "Explain" action on the stream that analyzes the logged data and returns:
  - Trend descriptions and anomaly detection
  - Temporal patterns (bursts, gaps)
  - Suggested next debugging steps
  - Two modes: built-in heuristic analysis (no API key) and optional OpenAI-powered analysis (API key input field)

---

## 3. Core UI Components

These components appear across multiple scenes. Describe their functionality here; their visual treatment and placement are up to you.

### 3.1 Stream Card

A self-contained unit representing one log stream. Every stream has three zones:

**Header**:
- Stream name (e.g., "Nested Loop", "Warnings")
- Color indicator (each stream has a unique color)
- Entry count (how many log entries exist, e.g., "12")
- Drag handle (allows repositioning)
- Active highlight breadcrumb: when a property is highlighted, show the path (e.g., `user.stats.loginCount`) with options to copy or clear

**Body** (three view modes, switchable):
- **List**: Scrollable chronological list. Each row: index number, timestamp, value content via Object Explorer.
- **Slider**: One entry at a time. Navigation: prev/next buttons + range scrubber + "N / Total" label. Shows timestamp. Changed values since previous entry are visually marked.
- **Bar Chart**: For numeric streams only. Each entry rendered as a horizontal bar with its value.

**Menu** (stream-level controls):
- Pause / Resume toggle
- Collapse / Unfold toggle
- Delete (only when paused)
- View mode switcher (List / Slider / Bar)
- Explain button (opens LLM Insight panel)

### 3.2 Object Explorer

Renders any JavaScript value as an interactive tree. Used inside stream entries.

**Primitives**: Strings, numbers, booleans each have distinct visual treatment (e.g., strings in green, numbers in orange, booleans in yellow — but exact colors are up to you).

**Objects & Arrays**: Rendered as an indented tree with expandable/collapsible branches.
- Clicking a bracket `{` or `}` toggles expand/collapse
- Collapsed objects show a summary like `{...3}` (3 keys)
- Collapsed arrays show `[5]` (5 items)

**Property Highlighting**: The user can activate highlighting on a specific key. When active:
- Only that property path and its ancestors are displayed; other properties are hidden
- The highlighted path is shown in the stream header as a breadcrumb
- This makes it easy to track one value across many log entries

**Change Detection** (in slider mode): When stepping between entries, values that differ from the previous entry are visually marked (e.g., background flash, underline, or color change).

**Synchronized State**: Within a stream, expand/collapse and highlight state is shared across all entries — expanding a branch in entry #1 expands it everywhere.

### 3.3 Log Panel

A container that holds multiple Stream Cards. Provides panel-level controls:

- **Filter**: Text input to search/filter streams by name
- **Stream count**: Shows how many streams currently exist
- **Clear all**: Removes all streams at once
- **Collapse toggle**: Minimize the entire panel

**Empty state**: When no streams exist, show a friendly message indicating how to start (e.g., "Use `log(value)` to start logging!").

### 3.4 LLM Insight Panel

An expandable section within a Stream Card that shows AI-generated analysis.

- **Heuristic mode button**: Runs a local analysis (no API key needed), returns pattern descriptions
- **AI mode button**: Uses OpenAI API for deeper analysis
- **API key input**: Text field for the user's OpenAI API key (only shown when AI mode is selected)
- **Result display**: Monospace text area showing the analysis output (trends, anomalies, patterns, debugging suggestions)

---

## 4. Experience Requirements

These are constraints on the overall experience, not specific visual decisions.

### 4.1 Cause-Effect Clarity

When the user triggers a demo action (clicks a button, moves the mouse), the resulting log output must be **visually and spatially connected** to that action. The user should never wonder "where did the output go?" or "which demo produced this stream?"

### 4.2 Progressive Disclosure

Features should be introduced gradually through the scene progression:
- Scene 1 introduces the most basic concept (streams, colors, list view)
- Scene 2 adds interactivity (expand/collapse, highlight, slider)
- Scene 3 adds spatial context (element attachment)
- Scene 4 adds management tools (filter, collapse, pause, delete)
- Scene 5 adds extensions (sparkline, bar chart, LLM insight)

A visitor who goes through scenes 1-5 in order should feel like they're learning the tool step by step.

### 4.3 Feature Discoverability

Every interactive feature must be discoverable without prior knowledge. If a property key can be highlighted, the user should see an affordance for it (tooltip, subtle instruction, visual hint). Don't rely on hidden gestures like "double-click" or "right-click" without some form of guidance.

### 4.4 Scene Independence

Each scene should be self-contained — its demo trigger and log output are clearly paired. If the layout allows multiple scenes to be visible simultaneously, their outputs should not mix or interfere with each other.

### 4.5 Responsive Consideration

The page should work well on desktop screens (1280px+ width). Mobile is not a priority, but the layout should degrade gracefully on narrower screens.
