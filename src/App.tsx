import { useState, useCallback } from 'react';
import { Nav } from './components/Nav';
import { Sidebar } from './components/Sidebar';
import { LogPanel } from './components/LogPanel';
import { SceneOrganizedStreams } from './scenes/SceneOrganizedStreams';
import { SceneExploreData } from './scenes/SceneExploreData';
import { SceneContextualLogging } from './scenes/SceneContextualLogging';
import { SceneTamingChaos } from './scenes/SceneTamingChaos';
import { SceneAIExtensions } from './scenes/SceneAIExtensions';
import { logStore } from './logit';
import React from 'react';

const SCENES: Record<number, React.ComponentType> = {
  1: SceneOrganizedStreams,
  2: SceneExploreData,
  3: SceneContextualLogging,
  4: SceneTamingChaos,
  5: SceneAIExtensions,
};

export default function App() {
  const [activeScene, setActiveScene] = useState(1);

  const switchScene = useCallback((n: number) => {
    logStore.clearAll();
    setActiveScene(n);
  }, []);

  const ActiveScene = SCENES[activeScene];

  return (
    <div className="h-full bg-surface">
      <Nav />
      <Sidebar activeScene={activeScene} onSceneChange={switchScene} />
      <main
        className="fixed top-12 bottom-0 overflow-y-auto bg-surface"
        style={{ left: '144px', right: '400px' }}
      >
        <div key={activeScene} className="animate-fade-in min-h-full">
          <ActiveScene />
        </div>
      </main>
      <aside className="fixed top-12 right-0 bottom-0 w-[400px] border-l border-outline-variant/10">
        <LogPanel />
      </aside>
    </div>
  );
}
