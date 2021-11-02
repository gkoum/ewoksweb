/* eslint-disable jsx-a11y/control-has-associated-label */
import type {
  Graph,
  EwoksNode,
  EwoksRFNode,
  EwoksLink,
  EwoksRFLink,
  GraphEwoks,
  RFNode,
  nodeInputsOutputs,
  GraphRF,
} from '../types';

function assertLog(statement, severity = 'info') {
  // severity can be error, warning, info
  if (severity === 'error') {
    console.error(statement);
  } else if (severity === 'warning') {
    console.warn(statement);
  } else {
    console.log(statement);
  }
}

function includes(entity: {}, label: string, properties: string[]) {
  console.info(entity, properties);
  let result = true;
  properties.forEach((pr) => {
    if (Object.keys(entity).includes(pr)) {
      assertLog(`${label} has a ${pr}`);
    } else {
      assertLog(`${label} does not have a ${pr}`, 'error');
      result = false;
    }
  });
  return result;
}

export function validateEwoksGraph(graph) {
  const result = [];
  // graph structure
  result.push(
    includes(graph, `graph: ${graph.graph && graph.graph.id}`, [
      'graph',
      'nodes',
      'links',
    ])
  );
  result.push(
    includes(graph.graph, `graph.graph: ${graph.graph.id}`, [
      'id',
      'label',
      'input_nodes',
      'output_nodes',
      'uiProps',
    ])
  );
  result.push(
    graph.nodes.forEach((nod) =>
      includes(nod, `node: ${nod.id}`, [
        'id',
        'label',
        'task_type',
        'task_identifier',
        'uiProps',
      ])
    )
  );
  // not uiProps position warn
  result.push(
    graph.links.forEach((link) =>
      includes(link, `Link from: ${link.source}`, ['source', 'target'])
    )
  );

  //type of some properties

  // relationships between properties
  const nodeIds = new Set(graph.nodes.map((nod) => nod.id));
  if (nodeIds.size !== graph.nodes.length) {
    result.push(false);
    console.error('At least one node id is not unique');
  }

  graph.links.forEach((link, index) => {
    if (link.source === link.target) {
      result.push(false);
      console.error(`link ${index} has the same source-target`);
    } else if (nodeIds.has(link.source) && nodeIds.has(link.target)) {
      result.push(true);
    } else {
      result.push(false);
      console.error(`link ${index} has wrong source and/or target node id`);
    }
  });

  console.log(result);
  return { result: !result.includes(false), logs: {} };
}