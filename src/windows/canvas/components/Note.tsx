import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWidgetContainerContext, Widget, WidgetProps } from './Widget';
import { IoAdd, IoClose } from 'react-icons/io5';

export interface NoteProps extends Omit<WidgetProps, 'children'> {
  onMove?: (x: number, y: number) => void;
}

export function Note(props: NoteProps) {
  const context = useWidgetContainerContext();
  const focused = context.focused === props.id;
  const [content, setContent] = useState('');

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - startX;
      const offsetY = e.clientY - startY;
      props.onMove?.(props.x + offsetX, props.y + offsetY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    // e.preventDefault();
  };

  return (
    <Widget
      id={props.id}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    >
      <div className='tw-h-8'>
        <motion.div
          className='tw-bg-gray-200 tw-overflow-hidden'
          onMouseDown={onMouseDown}
          variants={{
            open: {
              height: 32,
            },
            closed: {
              height: 8,
            },
          }}
          animate={focused ? 'open' : 'closed'}
        >
          {focused && (
            <div className='tw-h-8 tw-flex tw-justify-between'>
              <div className='tw-flex'>
                <span className='tw-p-2'>
                  <IoAdd />
                </span>
              </div>
              <div className='tw-flex'>
                <span className='tw-p-2'>
                  <IoClose />
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <div className='tw-flex tw-flex-col tw-p-2 tw-flex-auto tw-gap-4'>
        <textarea
          className='tw-flex-auto tw-outline-none'
          placeholder='Content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
    </Widget>
  );
}
