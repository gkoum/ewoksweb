// https://docs.google.com/document/d/1kGRwyrPJQfpx9xUND6Epei2oa71rXeWRZ3owRDglVHk/edit#heading=h.1p7naowyrq09
// https://confluence.esrf.fr/pages/viewpage.action?spaceKey=AAWWK&title=Automation+and+Analysis+Workflows
// https://confluence.esrf.fr/display/AAWWK/Zocalo
// https://discourse.jupyter.org/t/tool-for-notebook-workflows/3764
// https://gitlab.esrf.fr/denolf/workflow_concepts/-/blob/master/doc/workflows_meeting_march2021.pdf

// ----------------------------------------
// PROBLEMS with certain workflows

// -AnalyseKappa positioning problem
// -BesTestExecution missing link
// -BurnStrategy 500

// -Characterisation.json breaks because a (target: "Join") is used in a link
// but it is not in the nodes -> Handle error in graph "name"?

// -EnhancedCharacterisation.json a loop is not visuilized well as
// links cross nodes. Fix by custom link that bends around nodes?

// -CollectAndProcessBurningStrategy.json breaks with 500 as it has
// task_identifier: "com.isencia.passerelle.edm.actor.transform.AddResultActor.json"
// in a task_type: "graph" but there is no such graph id to fetch

// -CryoEMDataArchive.json again the loop results in a bad graph
// -CryoEMProcessGrid.json worst loop
// -MXPressDataCOllection absolut mess

// -DIMPLE.json strainge 2 independet graphs

// -ExecuteBurnStrategy breaks 500 com.isencia.passerelle.edm.actor.transform.AddResultActor.json

// -ExecuteHelicalCharacterisation.json 2 indipendant graphs
// links ending also up and down? resolves loop visulization too

// -ExecuteKappaReorientation.json multiple outputs to subgraphs are not working
// ---------------------------------------------
// FEATURES

// - task management...

// -have a flask that saves on disk for now with rest for workflows and tasks

// -REST for tasks in dialog...

// -REST for workflows on dialog to manage them

// -input-outputs can be changed but not saving in the left pane. create inputs-outputs but not draw them?

// -ids in nodes and links need to be unique -> defined in the front when created to be unique onConnect, onDrop

// -id of graph given by the user? needs to be unique! If not the server should propose

// -Spinner for each load...

// -conditions

// -styling options in a new accordion inside nodes-edges accordion with more choices

// -Validator for graphs and not break in any conditions

// ----------------------------------------
// BUGS

// - moreHnadles is not saved

// - I have MXPressE and try to import MXPressA_aparture_10um as a subgraph
// and when I go into that subgraph CommonPrepare experiment is in red even
// if I have it in the recent and already part of the workingGraph
// when save and reopen all reds are gone...

// - did find a comma in uploaded json file and crashed,
// need to validate json strucrure and inform but not crash

// - comment on links not saved

// - map all data is not saved on save link from sidebar

// - same with on error it wont red and save  ---- inputs_complete seems to work

// -initial get graph the left pane should show details of it
// and not wait for click a node

// -add subgraph from dashboard is not working if no other node exists in a new graph
//  store 377 does not have a subgraph the first time... investigate

// -data mapping breaks when a graph is one of the nodes

// -conditions get saved like that
// "conditions": [
// { "id": "ppfdict", "name": "ppfdict", "value": "4", "isEditMode": true }
//  ],
// keep only name and value

// ExecuteMXPressOrig.json: Multiple calls are being made as subgraphs are re-requested in a single draw

// sidebar text changes the width of sidebar when long especialy in task_identifier

const nodes = {
  id: '',
  type: 'class, method, graph ...', // must be clear and draw conclusions from both key and value of a dictionary,
  name: 'the class or method... name',
  inputs: [{}], // all inputs including static seem to semantically belong to a node and not use links to know them,
  outputs: [{}], // all'
  inputs_complete: '?',
  task_generator: '',
  // -- visual additions
  graphical_params: {
    position: 'in the diagram',
    nodeType: 'input, output, middle, custom: {has_properties }',
    customProps: { prop1: 1 },
    style: 'css properties',
  },
};

// I would leave the node take care of the subgraph it includes and the "links inside a links" structure
// you have an input to node that needs to be mapped to an input to 1 or more nodes in the subgraph
// inputs: {key1: value1, key2:  value2} mapping [[key1, subNode1], [key2, subNode2]]

// 1. get the graph ->
// 2. search for subgraphs in it (async) ->
// 3. draw node-subgraphs and handle missing (async) ->
// 4. draw links of a graph and complete graph in react flow

// recentGraphs is GrahRF[] ready to by used

// 1. The subgraph should be a decoupled entity that could change any given moment.
// 2. Even the subgraph input node can change its name and the super-graph should remain unaltered.
// 3. The subgraph has its own json representation and should only be referenced from the supergraph with id.
// 4. All graphs have a unique id (or name?)
// 5. When using a subgraph we create an instance of it upon which changes can be made to alter it from the original one?
// 6. The supergraph needs to just assign 1 or more links to the inputs of the subgraph
// 7. TREAT IT LIKE A NODE in every way.
// 8. The rest of the info will be included at the decoupled subgraph as if it was an supergraph as it can as well be.

// we need when a graph is presented to search and fetch any first layer subgraphs
// 1. new graph from dashboard
// 2. add subgraph from sidebar
// 3. on doubleClick node-subgraph from canvas

// WE NEED A HOOK TO GET SUBGRAPHS OF ANY GRAPH:
// has access to recentGraphs and if not find them: useSubGraphs
//

// const ewoksGraph = getGraph(graph.task_identifier);
// const linksArr = [
//   'http://mxbes2-1707:38280/ewoks/workflow/CommonPrepareExperiment.json',
//   'http://mxbes2-1707:38280/ewoks/workflow/TroubleShooting.json',
// ];
