import { getSubgraphs } from '../utils';
import { validateEwoksGraph } from './EwoksValidator';

export async function findAllSubgraphs(graphToSearch, recentGraphs) {
  console.log(graphToSearch);
  let subsToGet = [graphToSearch];
  const newNodeSubgraphs = [];

  // Get for each graph all subgraphs it includes
  while (subsToGet.length > 0) {
    console.log('getting subgraphs for:', subsToGet[0]);
    // Get for the first in subsToGet all subgraphs
    // eslint-disable-next-line no-await-in-loop
    const allGraphSubs = await getSubgraphs(subsToGet[0], recentGraphs);
    console.log('allGraphSubs', allGraphSubs, subsToGet);
    // store them as ewoksGraphs for later transforming to RFGraphs
    allGraphSubs.forEach((gr) => newNodeSubgraphs.push(gr));
    console.log(newNodeSubgraphs);
    // drop the one we searched for its subgraphs
    subsToGet.shift();
    // add the new subgraphs in the existing subgraphs we need to search
    subsToGet = [...subsToGet, ...allGraphSubs];
    console.log('subsToGet', subsToGet);
    // validate the next graph to search for subgraphs
    if (subsToGet.length > 0 && validateEwoksGraph(subsToGet[0])) {
      console.log('validated:', subsToGet[0].graph.id);
    } else if (subsToGet.length === 0) {
      console.log('Finished ok');
    } else {
      console.log('NOT validated');
    }
    console.log(subsToGet);
  }
  // TODO: Attempt to remove re-fetching the same subgraph
  // let subsToGet = [workingGraph];
  // const allSubs = new Set();
  // allSubs.add(workingGraph.graph.id);
  // const newNodeSubgraphs = [];

  return newNodeSubgraphs;
}
