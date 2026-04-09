# Log-it Reproduction

> Reproducing **Log-it: Supporting Programming with Interactive, Contextual, Structured, and Visual Logs** (CHI '23) — with two proposed extensions.

**Live Demo:** [cs702.distribrain.com](https://cs702.distribrain.com)

**Original Paper:** Jiang, P., Sun, F., & Xia, H. (2023). *Log-it: Supporting Programming with Interactive, Contextual, Structured, and Visual Logs.* CHI '23. [DOI](https://doi.org/10.1145/3544548.3581403)

**Original Package:** [`log-here-now`](https://www.npmjs.com/package/log-here-now) on NPM

---

## What is Log-it?

Logging (`console.log()`) is the most common way programmers inspect program behavior, but log output is a linear stream of plain text — lacking structure, context, and visual representation. **Log-it** replaces `console.log()` with a `log()` function that organizes output into interactive **Streams**, each with structured layouts, contextual information, and visual representations.

## Reproduced Features

### Component 1: Log Stream Architecture
- A `log()` function with chainable API: `.name()`, `.color()`, `.id()`, `.element()`
- **Stream Header** — name, entry count, drag handle, color indicator
- **Stream Body** — chronological list of logged items
- **Stream Menu** — pause/resume, collapse/unfold, delete, view mode toggle

### Component 2: Interactive Data Exploration
- **Property Highlighting** — double-click a key to focus on a specific property across all entries; right-click to collect multiple properties for side-by-side comparison
- **Synchronized Interaction** — expand/highlight/scroll operations on one log entry are broadcast to all entries in the same Stream
- **In-Place Sliding** — a slider replaces the linear list, showing one entry at a time with changed values highlighted

### Component 3: Context Embedding & Visualization
- **Color Coding** — each Stream is assigned a distinct color for quick visual identification
- **Element Attachment** — Streams can be attached to page elements via `.element('id')`, placing logs next to the relevant UI components
- **Number Visualization** — numeric values are displayed as horizontal bar charts with optional proportional mode

### Extension 1: LLM-Powered Log Insight (New)
An "Explain" button on each Stream that analyzes log data and returns:
- Trend descriptions and anomaly detection
- Temporal patterns (bursts, gaps)
- Suggested next debugging steps

Two modes: built-in heuristic analysis (no API key needed) and optional OpenAI API integration.

### Extension 2: Log Timeline Sparkline (New)
A miniature timeline below each Stream header:
- Horizontal axis represents time; each dot marks a log event
- For numeric Streams, a line chart shows value trends
- Responds to the paper's future work direction of treating "log messages as data points" (Section 7.3)

### Out of Scope
Per our project proposal, the following are excluded:
- VS Code extension (AST parsing, in-editor color coding)
- AST-dependent features (Scope Indentation, Showing Original Code)
- Area Filter and Unified Stream view

## Project Structure

```
src/
├── logit/                        # Core Log-it library
│   ├── log.ts                    # log() function with chainable API
│   ├── store.ts                  # Central store managing all streams
│   ├── types.ts                  # TypeScript type definitions
│   ├── colors.ts                 # Color generation for streams
│   ├── hooks.ts                  # React hooks (useLogStreams, useStreamActions)
│   ├── logit.css                 # UI styles
│   ├── index.ts                  # Public exports
│   └── components/
│       ├── LogPanel.tsx           # Main panel container
│       ├── StreamView.tsx         # Single stream UI (header/body/menu)
│       ├── ObjectExplorer.tsx     # Interactive nested object tree
│       ├── BarChart.tsx           # Horizontal bar chart visualization
│       ├── TimelineSparkline.tsx  # Extension 2: sparkline timeline
│       └── LLMInsight.tsx         # Extension 1: LLM analysis panel
├── demo/
│   ├── DemoApp.tsx               # 5 interactive demo scenarios
│   └── demo.css                  # Demo page styles
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

## Demo Scenarios

The demo app includes 5 scenarios that map to the paper's evaluation tasks:

| #   | Scenario                     | Paper Reference                       | Features Demonstrated                                       |
| --- | ---------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| 1   | **Nested Loop Tracking**     | C1 — logs lack organization           | Stream grouping, In-Place Sliding, Bar Chart                |
| 2   | **Element Position Debug**   | C3 — context loss from view switching | Element Attachment, Property Highlighting                   |
| 3   | **Cluttered Log Locating**   | C1 — locating logs in clutter         | Color Coding, filtering, collapse/pause                     |
| 4   | **Object Exploration**       | C2 — data structures lack interaction | Property Highlighting, Synchronized Interaction, Collection |
| 5   | **Real-Time Mouse Tracking** | C4 + Section 7.3 future work          | Timeline Sparkline, LLM Insight                             |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone git@github.com:doem97/cs702_logit.git
cd cs702_logit
npm install
npm run dev
```

Open http://localhost:5173 — the demo app is on the left, the Log-it panel is on the right.

### Build for Production

```bash
npm run build
```

Output is in `dist/`.

## Usage (as a library)

```tsx
import { log, LogPanel } from './logit';

// Replace console.log() with log()
log('hello world');

// Chainable API
log(someObject)
  .name('My Stream')
  .color('#E57373')
  .element('target-div');

// Render the log panel in your React app
function App() {
  return (
    <>
      <YourApp />
      <LogPanel position="right" width={420} />
    </>
  );
}
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 5** (dev server & build)
- Canvas API (Timeline Sparkline)
- OpenAI API (optional, for LLM Insight)

## Team

| Name         | Email                             |
| ------------ | --------------------------------- |
| Zichen Tian  | zichen.tian.2023@phdcs.smu.edu.sg |
| Huihui Huang | hh.huang.2024@phdcs.smu.edu.sg    |
| Ni Zhang     | ni.zhang.2025@phdcs.smu.edu.sg    |

**Course:** CS702 — Computational Interaction, Singapore Management University

## License

This is a course project reproduction for academic purposes.
