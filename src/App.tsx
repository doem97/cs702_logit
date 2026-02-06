import { LogPanel } from './logit';
import { DemoApp } from './demo/DemoApp';
import './demo/demo.css';

function App() {
  return (
    <>
      <DemoApp />
      <LogPanel position="right" width={420} />
    </>
  );
}

export default App;
