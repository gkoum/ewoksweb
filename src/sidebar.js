/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';

const sidearrow = () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the left.
      </div>
      <div
        role="button"
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        role="button"
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        role="button"
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
    </aside>
  );
};

export default sidearrow;
