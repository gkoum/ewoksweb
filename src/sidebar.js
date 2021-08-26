/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

function Sidebar(props) {
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
      <div>Id: {props.element.id}</div>
      <div>Type: {props.element.type}</div>
      <div>Label: {props.element.data && props.element.data.label}</div>
      <div>
        Position: {props.element.position && props.element.position.x},{' '}
        {props.element.position && props.element.position.y}
      </div>
    </aside>
  );
}

export default Sidebar;
