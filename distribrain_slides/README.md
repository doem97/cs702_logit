# DistriBrain Slides Plugin

Claude Code plugin for generating web-based presentation slides (React + Vite + Framer Motion) from a script or outline.

## Usage

In the repo root:

```bash
claude --plugin-dir ./distribrain_slides
```

Then tell Claude: "帮我从这个讲稿生成 slides" or "make slides from `path/to/script.md`".

Claude will walk through an 8-phase process — splitting the script, designing the visual spec, and building the slide components — pausing for your approval at key stages.

## What's Inside

```
distribrain_slides/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── slides-maker/
│       └── SKILL.md         # 8-phase workflow instructions
└── template/
    ├── SLIDE_PLAN_TEMPLATE.md   # Slide plan format
    ├── examples/                # Reference slide plans
    └── scaffold/                # React + Vite starter project
        └── src/
            ├── components/      # Shared UI components
            ├── slides/          # One file per slide (S00.jsx, ...)
            ├── tokens.js        # Design tokens (colors, fonts)
            └── motionPresets.js # Shared Framer Motion presets
```

## Output

Claude creates a `slides/` directory in your project with a runnable Vite app:

```bash
cd slides
npm install
npm run dev   # → http://localhost:5173
```
