import { useState } from 'react';
import { Note } from './components/Note';
import { WidgetContainerProvider } from './components/Widget';

export function App() {
  const [pos1, setPos1] = useState({ x: 10, y: 10 });
  const [pos2, setPos2] = useState({ x: 100, y: 100 });

  return (
    <WidgetContainerProvider>
      <div className='tw-flex-auto tw-relative'>
        <Note
          id='asldkfj'
          x={pos1.x}
          y={pos1.y}
          width={300}
          height={300}
          onMove={(x, y) => setPos1({ x, y })}
        />
        <Note
          id='asldkfjsdf'
          x={pos2.x}
          y={pos2.y}
          width={300}
          height={300}
          onMove={(x, y) => setPos2({ x, y })}
        />
      </div>
    </WidgetContainerProvider>
  );
}
