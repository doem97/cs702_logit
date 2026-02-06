/**
 * DemoApp: Interactive demonstration of all Log-it features.
 *
 * Tasks from the proposal's Evaluation Plan:
 * 1. Track a variable across iterations of a nested loop
 * 2. Debug the position and size of a page element
 * 3. Locate a specific log among cluttered output
 *
 * Plus demonstrations of:
 * - Property Highlighting (double-click key)
 * - Synchronized Interaction
 * - In-Place Sliding
 * - Color Coding
 * - Element Attachment
 * - Number Visualization (bar chart)
 * - LLM-Powered Log Insight (Extension 1)
 * - Timeline Sparkline (Extension 2)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { log } from '../logit';

export const DemoApp: React.FC = () => {
  return (
    <div className="demo-app">
      <header className="demo-header">
        <div className="demo-header-badge">CHI '23 Reproduction</div>
        <h1>Log-it</h1>
        <p className="demo-header-tagline">
          Interactive, Structured, and Visual Logs for Programming
        </p>
        <div className="demo-header-meta">
          <span className="demo-header-chip">Jiang, Sun &amp; Xia</span>
          <span className="demo-header-chip demo-header-chip-ext">+ LLM Insight</span>
          <span className="demo-header-chip demo-header-chip-ext">+ Timeline Sparkline</span>
        </div>
        <p className="demo-header-desc">
          Explore 5 interactive scenarios below. The log panel on the right captures every <code>log()</code> call
          with color-coded streams, property highlighting, slider navigation, and more.
        </p>
      </header>

      <div className="demo-sections">
        <DemoSection1_NestedLoop />
        <DemoSection2_ElementDebug />
        <DemoSection3_ClutteredLogs />
        <DemoSection4_ObjectExploration />
        <DemoSection5_MouseTracking />
      </div>
    </div>
  );
};

/**
 * Demo 1: Track a variable across iterations of a nested loop
 */
const DemoSection1_NestedLoop: React.FC = () => {
  const [running, setRunning] = useState(false);

  const runNestedLoop = useCallback(() => {
    setRunning(true);
    let step = 0;
    const outer = 3;
    const inner = 4;

    const interval = setInterval(() => {
      const i = Math.floor(step / inner);
      const j = step % inner;
      if (i >= outer) {
        clearInterval(interval);
        setRunning(false);
        return;
      }

      log({
        i,
        j,
        product: i * j,
        sum: i + j,
        phase: i === 0 ? 'init' : i === 1 ? 'process' : 'finalize',
      })
        .id('nested-loop')
        .name('Nested Loop')
        .color('#4A90D9');

      // Also log just the product as a number stream
      log(i * j)
        .id('product-values')
        .name('Products')
        .color('#E57373');

      step++;
    }, 300);
  }, []);

  return (
    <div className="demo-section">
      <h2>1. Nested Loop Tracking</h2>
      <p>
        Track variables <code>i</code>, <code>j</code>, and their product across a nested loop.
        Try <strong>In-Place Sliding</strong> to see value changes, and <strong>Bar Chart</strong> mode for products.
      </p>
      <button
        className="demo-btn"
        onClick={runNestedLoop}
        disabled={running}
      >
        {running ? 'Running...' : 'Run Nested Loop'}
      </button>
    </div>
  );
};

/**
 * Demo 2: Debug the position and size of a page element
 */
const DemoSection2_ElementDebug: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState({ width: 120, height: 80 });

  const logElementInfo = useCallback(() => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    log({
      tagName: boxRef.current.tagName,
      id: boxRef.current.id,
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      visible: rect.top >= 0 && rect.left >= 0,
    })
      .id('element-debug')
      .name('Element Info')
      .color('#81C784')
      .element('debug-target');
  }, []);

  const resizeBox = useCallback(() => {
    const newWidth = 80 + Math.random() * 200;
    const newHeight = 60 + Math.random() * 120;
    setBoxSize({ width: newWidth, height: newHeight });
    // Log after state update
    setTimeout(() => logElementInfo(), 50);
  }, [logElementInfo]);

  return (
    <div className="demo-section">
      <h2>2. Element Position &amp; Size Debug</h2>
      <p>
        Inspect the bounding box of a page element. The stream is <strong>attached</strong> to the element.
        Try double-clicking a property name to <strong>highlight</strong> it.
      </p>
      <div className="demo-element-area">
        <div
          id="debug-target"
          ref={boxRef}
          className="demo-target-box"
          style={{ width: boxSize.width, height: boxSize.height }}
        >
          Target Element
        </div>
      </div>
      <div className="demo-btn-group">
        <button className="demo-btn" onClick={logElementInfo}>
          Log Element Info
        </button>
        <button className="demo-btn demo-btn-secondary" onClick={resizeBox}>
          Resize &amp; Log
        </button>
      </div>
    </div>
  );
};

/**
 * Demo 3: Locate a specific log among cluttered output
 */
const DemoSection3_ClutteredLogs: React.FC = () => {
  const [generating, setGenerating] = useState(false);

  const generateClutter = useCallback(() => {
    setGenerating(true);
    let count = 0;
    const total = 15;

    const interval = setInterval(() => {
      if (count >= total) {
        clearInterval(interval);
        setGenerating(false);
        return;
      }

      // Generate various types of logs
      const types = ['info', 'warning', 'data', 'event', 'status'];
      const type = types[count % types.length];

      switch (type) {
        case 'info':
          log(`App initialized module #${count}`)
            .id('app-info')
            .name('Info')
            .color('#90A4AE');
          break;
        case 'warning':
          log({ level: 'warn', message: `Slow query detected: ${50 + count * 12}ms`, query: `SELECT * FROM table_${count}` })
            .id('app-warnings')
            .name('Warnings')
            .color('#FFB74D');
          break;
        case 'data':
          log({
            userId: 1000 + count,
            action: ['click', 'scroll', 'type', 'navigate'][count % 4],
            timestamp: Date.now(),
            duration: Math.random() * 200,
          })
            .id('user-events')
            .name('User Events')
            .color('#BA68C8');
          break;
        case 'event':
          log(Math.sin(count * 0.5) * 100 + 100)
            .id('metric-values')
            .name('Metrics')
            .color('#4DD0E1');
          break;
        case 'status':
          log({
            service: ['auth', 'api', 'db'][count % 3],
            status: count % 7 === 0 ? 'degraded' : 'healthy',
            latency: 10 + Math.random() * 90,
            connections: Math.floor(Math.random() * 50),
          })
            .id('service-status')
            .name('Service Status')
            .color('#AED581');
          break;
      }

      count++;
    }, 200);
  }, []);

  return (
    <div className="demo-section">
      <h2>3. Locating Logs in Cluttered Output</h2>
      <p>
        Generates multiple streams of different types. Use <strong>color coding</strong> to identify streams,
        <strong> collapse</strong> irrelevant ones, and <strong>filter</strong> in the panel header.
      </p>
      <button
        className="demo-btn"
        onClick={generateClutter}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Cluttered Logs'}
      </button>
    </div>
  );
};

/**
 * Demo 4: Complex object exploration with Property Highlighting
 */
const DemoSection4_ObjectExploration: React.FC = () => {
  const logComplexObject = useCallback(() => {
    const userData = {
      user: {
        id: Math.floor(Math.random() * 10000),
        profile: {
          name: 'Alice',
          email: 'alice@example.com',
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: {
              email: true,
              push: false,
              sms: true,
            },
          },
        },
        stats: {
          loginCount: Math.floor(Math.random() * 100),
          lastActive: new Date().toISOString(),
          sessions: Math.floor(Math.random() * 10),
        },
      },
      metadata: {
        version: '2.1.0',
        region: 'us-west-2',
        timestamp: Date.now(),
      },
    };

    log(userData)
      .id('complex-object')
      .name('User Data')
      .color('#F06292');
  }, []);

  return (
    <div className="demo-section">
      <h2>4. Object Exploration</h2>
      <p>
        Log complex nested objects. <strong>Double-click</strong> a property key to highlight it across all entries.
        <strong> Right-click</strong> to collect multiple properties for comparison.
      </p>
      <button className="demo-btn" onClick={logComplexObject}>
        Log Complex Object
      </button>
    </div>
  );
};

/**
 * Demo 5: Mouse position tracking (real-time)
 */
const DemoSection5_MouseTracking: React.FC = () => {
  const trackingRef = useRef(false);
  const [tracking, setTracking] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!trackingRef.current) return;
      if (!areaRef.current) return;
      const rect = areaRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        log({
          x: Math.round(e.clientX - rect.left),
          y: Math.round(e.clientY - rect.top),
          clientX: e.clientX,
          clientY: e.clientY,
        })
          .id('mouse-pos')
          .name('Mouse Position')
          .color('#FFD54F');
      }
    };

    // Throttle to ~10fps
    let lastTime = 0;
    const throttled = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 100) return;
      lastTime = now;
      handleMouseMove(e);
    };

    window.addEventListener('mousemove', throttled);
    return () => window.removeEventListener('mousemove', throttled);
  }, []);

  const toggleTracking = useCallback(() => {
    trackingRef.current = !trackingRef.current;
    setTracking(trackingRef.current);
  }, []);

  return (
    <div className="demo-section">
      <h2>5. Real-Time Mouse Tracking</h2>
      <p>
        Track mouse position in the area below. Use the <strong>Timeline Sparkline</strong> to see temporal patterns,
        and <strong>In-Place Sliding</strong> to step through positions.
      </p>
      <button
        className={`demo-btn ${tracking ? 'demo-btn-active' : ''}`}
        onClick={toggleTracking}
      >
        {tracking ? '⏹ Stop Tracking' : '▶ Start Tracking'}
      </button>
      <div
        ref={areaRef}
        className={`demo-tracking-area ${tracking ? 'active' : ''}`}
      >
        {tracking ? 'Move your mouse here!' : 'Click "Start Tracking" then move your mouse here'}
      </div>
    </div>
  );
};
