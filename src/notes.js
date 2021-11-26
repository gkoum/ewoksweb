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

const upperGraph = {
  directed: true,
  graph: { name: 'TroubleShooting' },
  multigraph: false,
  nodes: [
    {
      id: 'CommonPrepareExperiment',
      task_type: 'graph',
      task_identifier: 'CommonPrepareExperiment.json',
      inputs: {
        // optional for defining a node autonomoysly and used be the end-user
        nonStatic: [{}], // arguments in links do the mapping of inputs to outputs
        static: [{}],
      },
      outputs: [],
      graphical_params: {},
    },
    {
      id: 'Prepare trouble shooting',
      ppfmethod: 'mx.src.prepareTroubleShooting.run',
    },
    {
      id: 'Check1 move of phi',
      ppfmethod: 'mx.src.checkMoveOfPhi.run',
    },
    {
      id: 'Set ISPyB status to success with error message',
      ppfmethod: 'mx.src.ispyb_set_status_success_with_errors.run',
    },
    {
      id: 'All tests ok',
      ppfmethod: 'mx.src.troubleShootingAllTestsOk.run',
    },
    {
      id: 'Set ISPyB to success',
      ppfmethod: 'mx.src.ispyb_set_status_success.run',
    },
  ],

  links: [
    {
      source: 'Prepare trouble shooting',
      target: 'CommonPrepareExperiment', // this is a graph from nodes
      arguments: {}, // map output of node to inputs in nodegraph. "In" is an input not a node
      all_arguments: Boolean,
      conditions: {}, // map last nodes outputs to expected values
      on_error: Boolean,
      // other
      effects: {}, // if link is good to go some sub-actions FSM formalism
      // the existing
      // "subgraph_nodes": [
      //     {
      //         "source": "Prepare trouble shooting",
      //         "target": "In",
      //         "all_arguments": true
      //     }
      //  ]
    },
    {
      source: 'CommonPrepareExperiment',
      target: 'Check move of phi',
      links: [
        {
          source: 'Out',https://confluence.esrf.fr/pages/viewpage.action?spaceKey=AAWWK&title=Automation+and+Analysis+Workflows
          target: 'Check move of phi',
          all_arguments: true,
        },
      ],
    },
  ],
};

const subgraph = {
  directed: true,
  graph: { name: 'CommonPrepareExperiment' },
  multigraph: false,
  inputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  outputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  nodes: [
    // {
    //     "id": "In",
    //     "ppfport": "output"
    // },
    // {
    //     "id": "Out",
    //     "ppfport": "input"
    // },
    {
      id: 'Init1 workflow',
      task_type: 'ppfmethod',
      task_name: 'mx.src.init_workflow.run',
      inputs: {
        nonStatic: [inputs.name],
      },
    },
    {
      id: 'Default1 parameters',
      ppfmethod: 'mx.src.common_default_parameters.run',
    },
    {
      id: 'Read1 motor positions',
      ppfmethod: 'mx.src.read_motor_positions.run',
    },
  ],

  links: [
    {
      source: 'In',
      target: 'Init workflow',
      all_arguments: true,
    },
    {
      source: 'Init workflow',
      target: 'Read motor positions',
      all_arguments: true,
    },
    {
      source: 'Default parameters',
      target: 'Out',
      all_arguments: true,
    },
    {
      source: 'Read motor positions',
      target: 'Default parameters',
      all_arguments: true,
    },
  ],
};

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

const graph = {
  inputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  outputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  nodes: [],
  edges: [],
};

// the node should as well be an autonomous entity and wait from the links to "know" its inputs.
// So all inputs must be specified in the node. inputs: [{}]
// do we at any point need different outputs from a node. outputs: [{}]


// referencing 2 layers down breaks? the decoupling


const graph = {
  "nodes": [
      {
          "id": "node1",
          "task_type": "method",
          "task_identifier": "__main__.myfunc",
          "inputs": {
              "name": "node1",
              "value": 0
          }
      },
      {
          "id": "node2",
          "task_type": "graph",
          "task_identifier": "subgraph.json"
      }
  ],
  "links": [
      {
          "source": "node1",
          "target": "node2",
          // "sub_graph_nodes": {
          to_target_input: "in1", // applicable when more than one inputs or else it can be defined in the node?
          // },
          "arguments": {
              "value": "return_value"
          }
      }
  ]
}


const subgraph = {
  "graph": {
    inputs: [
      {name: 'in1', to: 'subnode1'}
    ],
    outputs: [
      {name: 'out1', to: 'in1'}
    ],
    // "input_nodes": {
    //   "in1": [
    //     "subnode1",
    //     "in1b"
    //   ]
    // }
  },
  "nodes": [
    {
      "id": "subnode1",
      "task_type": "graph",
      "task_identifier": "subsubgraph.json"
    }
  ]
}

const subsubgraph = {
  "graph": {
    input: [
      {name: 'in1', to: 'subsubnode1'}
    ],
    // "input_nodes": {
    //   "in1": "subsubnode1"
    // }
  },
  "nodes": [
    {
      "task_type": "method",
      "task_identifier": "__main__.myfunc",
      "inputs": {
        "name": "subnode1",
        "value": 0
      },
      "id": "subsubnode1"
    }
  ],
  "links": []
}


let graph = {
  "nodes": [
    {
      "id": "node1",
      "task_type": "method",
      "task_identifier": "asks.simplemethods.add0"
    },
    {
      "id": "node2",
      "task_type": "graph",
      "task_identifier": "subgraph.json"
    },
    {
      "id": "node3",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    }
  ],
  "links": [
    {
      "source": "node1",
      "target": "node2",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_target": "in",
      }
    },
    {
      "source": "node2",
      "target": "node3",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_source": "out"
      }
    }
  ]
}

let subgraph = {
  "graph": {
    "input_nodes": { // specify all input nodes in1, in2...
      "in": { //  for in which is the default input
        "id": "task1" // task1 is a/the input node of the graph
      }
    },
    "output_nodes": { // All outputs out1, out2...
      "out": { //  out is
        "id": "subsubgraph", // the ssg node that is specified in this graph
        "sub_node": "out" // and since it is again a graph we map to the out of the inner graph
      // the ssg could have 2 outputs (out1, out2) and then we wouldn't know which one to get as out
      }
    }
  },
  "nodes": [
    {
      "id": "task1",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "task2",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "subsubgraph",
      "task_type": "graph",
      "task_identifier": "subsubgraph.json"
    }
  ],
  "links": [
    {
      "source": "task1",
      "target": "task2",
      "arguments": {
        "0": "return_value"
      }
    },
    {
      "source": "task2",
      "target": "subsubgraph",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_target": "in"
      }
    }
  ]
}

let subsubgraph = {
  "graph": {
    "input_nodes": {
      "in": {
        "id": "task1"
      }
    },
    "output_nodes": {
      "out": {
        "id": "subsubsubgraph",
        "sub_node": "out"
      }
    }
  },
  "nodes": [
    {
      "id": "task1",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "task2",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "subsubsubgraph",
      "task_type": "graph",
      "task_identifier": "subsubsubgraph.json"
    }
  ],
  "links": [
    {
      "source": "task1",
      "target": "task2",
      "arguments": {
        "0": "return_value"
      }
    },
    {
      "source": "task2",
      "target": "subsubsubgraph",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_target": "in"
      }
    }
  ]
}

let subsubsubgraph = {
  "graph": {
    "input_nodes": {
      "in": {
        "id": "task1"
      }
    },
    "output_nodes": {
      "out": {
        "id": "task2"
      }
    }
  },
  "nodes": [
    {
      "id": "task1",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "task2",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    }
  ],
  "links": [
    {
      "source": "task1",
      "target": "task2",
      "arguments": {
        "0": "return_value"
      }
    }
  ]
}


{
	"workflows": [
		"AnalyseKappa.json",
		"BesTestExecution.json",
		"BurnStrategy.json",
		"CalibrateKappa.json",
		"CenterRotationAxis.json",
		"CentreBeam.json",
		"CentrePin.json",
		"Characterisation.json",
		"CollectAndProcessBurningStrategy.json",
		"CollectReferenceImages.json",
		"CollectWithoutStrategy.json",
		"CommonDataCollection.json",
		"CommonErrorReporter.json",
		"CommonPrepareExperiment.json",
		"CreateLucidBackgroundImage.json",
		"CreateThumbnails.json",
		"CryoEMDataArchive.json",
		"CryoEMProcessGrid.json",
		"CryoEMProcessGridSquare.json",
		"CryoEMProcessMovie.json",
		"DIMPLE.json",
		"Dehydration.json",
		"DistanceCalibration.json",
		"DozorAndXDSAPP_OAR.json",
		"EDNAStrategy.json",
		"EDNA_dp.json",
		"EDNA_proc.json",
		"EDNA_proc_OAR.json",
		"EDNA_proc_SLURM.json",
		"EnergyInterleavedMAD.json",
		"EnhancedCharacterisation.json",
		"ExecuteBurnStrategy.json",
		"ExecuteDehydration.json",
		"ExecuteEnhancedCharacterisation.json",
		"ExecuteHelicalCharacterisation.json",
		"ExecuteKappaReorientation.json",
		"ExecuteMXPress.json",
		"ExecuteMXPressOrig.json",
		"ExecuteMXPressTest.json",
		"ExecuteMesh.json",
		"ExecuteMeshAndCollect.json",
		"ExecuteMeshBest3D.json",
		"ExecuteMeshBest3DGrid.json",
		"ExecuteMeshBest3D_2.json",
		"ExecuteVerticalLineScan.json",
		"ExecuteVisualReorientation.json",
		"HelicalCharacterisation.json",
		"ImprovedXrayCentring.json",
		"Is4a_MERGE.json",
		"Is4a_REPROCESS.json",
		"KappaReorientation.json",
		"LowDoseDC.json",
		"LowSymmetryOpenKappa.json",
		"MXPressA.json",
		"MXPressA_3500Gy.json",
		"MXPressA_aperture_100um.json",
		"MXPressA_aperture_10um.json",
		"MXPressA_aperture_15um.json",
		"MXPressA_aperture_30um.json",
		"MXPressA_aperture_50um.json",
		"MXPressA_aperture_Outbeam.json",
		"MXPressA_dozor.json",
		"MXPressA_dozorm.json",
		"MXPressA_meshBest.json",
		"MXPressDataCollection.json",
		"MXPressE.json",
		"MXPressEMulti.json",
		"MXPressERed.json",
		"MXPressESAD.json",
		"MXPressF.json",
		"MXPressH.json",
		"MXPressI.json",
		"MXPressK.json",
		"MXPressL.json",
		"MXPressM.json",
		"MXPressMultiCrystal.json",
		"MXPressO.json",
		"MXPressO_540.json",
		"MXPressP.json",
		"MXPressP_SAD.json",
		"MXPressPseudoHelical.json",
		"MXPressR.json",
		"MXPressR_180.json",
		"MXPressR_dehydration.json",
		"MXPressR_dehydration_1min_1pc.json",
		"MXPressR_dehydration_2min_1pc.json",
		"MXPressR_dehydration_2min_5pc.json",
		"MXPressR_dehydration_5min_5pc.json",
		"MXPressS.json",
		"MXScore.json",
		"Massif1DepositionsTwitter.json",
		"Massif1LongestLengthTwitter.json",
		"Massif1SamplesTwitter.json",
		"Massif1ShortestLengthTwitter.json",
		"Massif1VolumeTwitter.json",
		"Mesh2D.json",
		"MeshAndCollect.json",
		"MeshAndCollectFromFile.json",
		"MeshAndCollectUserInput.json",
		"MeshBest3D.json",
		"MeshScan.json",
		"PrepareAutoMesh.json",
		"PrepareMesh.json",
		"ShortXrayCentringVertical.json",
		"SmallXrayCentringExecute.json",
		"TestAutoInsitu.json",
		"TestBest3DCharacterisation.json",
		"TestCenterOfRotationAxis.json",
		"TestCollectAndSpectra.json",
		"TestInterleavedMad.json",
		"TestInversedLineScans.json",
		"TestLowDoseDC.json",
		"TestRDExpress.json",
		"TestSetGridData.json",
		"TestShortVerticalLineScan.json",
		"TroubleShooting.json",
		"TroubleShootingWithDialog.json",
		"TwoCentredPositionInput.json",
		"TwoMeshScans2.json",
		"VisualReorientation.json",
		"XDSAPP.json",
		"XDSAPP_OAR.json",
		"XDSAPP_SLURM.json",
		"XIA2_DIALS_OAR.json",
		"XIA2_DIALS_SLURM.json",
		"XrayCentring.json",
		"XrayCentringExecute.json",
		"XrayCentringVertical.json",
		"autoPROC.json",
		"autoPROC_OAR.json",
		"autoPROC_SLURM.json",
		"dozor_OAR.json",
		"dozor_SLURM.json",
		"grenades_fastproc_OAR.json",
		"grenades_fastproc_SLURM.json",
		"grenades_parallelproc_OAR.json",
		"grenades_parallelproc_SLURM.json",
		"xia2DIALS.json",
		"xia2DIALS_OAR.json",
		"xia2DIALS_SLURM.json",
		"MXPressR_setup.json"
	]
}


troubleshooting
{
	"graph": {
		"id": "TroubleShooting.json",
		"input_nodes": [
			{
				"id": "Start",
				"node": "Prepare trouble shooting"
			}
		],
		"label": "TroubleShooting",
		"output_nodes": [
			{
				"id": "Stop",
				"node": "Set Request Status to FINISHED"
			}
		],
		"uiProps": {}
	},
	"links": [
		{
			"map_all_data": true,
			"source": "Prepare trouble shooting",
			"sub_target": "In",
			"target": "CommonPrepareExperiment"
		},
		{
			"map_all_data": true,
			"source": "CommonPrepareExperiment",
			"sub_source": "Out",
			"target": "Check move of phi"
		},
		{
			"conditions": [
				{
					"source_output": "flagPhiMoved",
					"value": true
				}
			],
			"map_all_data": true,
			"source": "Check move of phi",
			"target": "All tests ok"
		},
		{
			"conditions": [
				{
					"source_output": "flagPhiMoved",
					"value": false
				}
			],
			"map_all_data": true,
			"source": "Check move of phi",
			"target": "Set ISPyB status to success with error message"
		},
		{
			"map_all_data": true,
			"source": "Set ISPyB status to success with error message",
			"target": "Set Request Status to FINISHED"
		},
		{
			"map_all_data": true,
			"source": "All tests ok",
			"target": "Set ISPyB to success"
		},
		{
			"map_all_data": true,
			"source": "Set ISPyB to success",
			"target": "Set Request Status to FINISHED"
		}
	],
	"nodes": [
		{
			"id": "CommonPrepareExperiment",
			"label": "CommonPrepareExperiment",
			"task_identifier": "CommonPrepareExperiment.json",
			"task_type": "graph",
			"uiProps": {
				"position": {
					"x": 380,
					"y": 214
				},
				"type": "internal"
			}
		},
		{
			"id": "Prepare trouble shooting",
			"label": "Prepare trouble shooting",
			"task_identifier": "mx.src.prepareTroubleShooting.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 191,
					"y": 214
				}
			}
		},
		{
			"id": "Set Request Status to FINISHED",
			"label": "Set Request Status to FINISHED",
			"task_identifier": "mx.src.requestStatusFINISHED.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 1390,
					"y": 328
				}
			}
		},
		{
			"id": "Check move of phi",
			"label": "Check move of phi",
			"task_identifier": "mx.src.checkMoveOfPhi.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 553,
					"y": 214
				}
			}
		},
		{
			"id": "Set ISPyB status to success with error message",
			"label": "Set ISPyB status to success with error message",
			"task_identifier": "mx.src.ispyb_set_status_success_with_errors.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 867,
					"y": 455
				}
			}
		},
		{
			"id": "All tests ok",
			"label": "All tests ok",
			"task_identifier": "mx.src.troubleShootingAllTestsOk.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 841,
					"y": 214
				}
			}
		},
		{
			"id": "Set ISPyB to success",
			"label": "Set ISPyB to success",
			"task_identifier": "mx.src.ispyb_set_status_success.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 1019,
					"y": 214
				}
			}
		}
	]
}

CommonPrepareExperiment
{
	"graph": {
		"id": "CommonPrepareExperiment.json",
		"input_nodes": [
			{
				"id": "In",
				"node": "Init workflow"
			}
		],
		"label": "CommonPrepareExperiment",
		"output_nodes": [
			{
				"id": "Out",
				"node": "Default parameters"
			}
		],
		"uiProps": {}
	},
	"links": [
		{
			"map_all_data": true,
			"source": "Init workflow",
			"target": "Read motor positions"
		},
		{
			"map_all_data": true,
			"source": "Read motor positions",
			"target": "Default parameters"
		}
	],
	"nodes": [
		{
			"id": "Init workflow",
			"label": "Init workflow",
			"task_identifier": "mx.src.init_workflow.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 301,
					"y": 95
				}
			}
		},
		{
			"id": "Default parameters",
			"label": "Default parameters",
			"task_identifier": "mx.src.common_default_parameters.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 706,
					"y": 131
				}
			}
		},
		{
			"id": "Read motor positions",
			"label": "Read motor positions",
			"task_identifier": "mx.src.read_motor_positions.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 496,
					"y": 114
				}
			}
		}
	]
}


CryoEMProcessGrid
{
	"graph": {
		"id": "CryoEMProcessGrid.json",
		"input_nodes": [
			{
				"id": "Start",
				"node": "Init grid processing"
			}
		],
		"label": "CryoEMProcessGrid",
		"output_nodes": [
			{
				"id": "Stop actor",
				"node": "Set Request Status"
			}
		],
		"uiProps": {}
	},
	"links": [
		{
			"map_all_data": true,
			"source": "Init grid processing",
			"target": "Get grid square lists"
		},
		{
			"conditions": [
				{
					"source_output": "doProcessGridSquare",
					"value": true
				}
			],
			"map_all_data": true,
			"source": "Get grid square lists",
			"target": "Process grid"
		},
		{
			"conditions": [
				{
					"source_output": "doProcessGridSquare",
					"value": false
				}
			],
			"map_all_data": true,
			"source": "Get grid square lists",
			"target": "Wait for new movie or grid square"
		},
		{
			"conditions": [
				{
					"source_output": "doProcessMovie",
					"value": true
				}
			],
			"map_all_data": true,
			"source": "Process grid",
			"target": "Launch movie processing"
		},
		{
			"conditions": [
				{
					"source_output": "doProcessMovie",
					"value": false
				}
			],
			"map_all_data": true,
			"source": "Process grid",
			"target": "Wait for new movie or grid square"
		},
		{
			"conditions": [
				{
					"source_output": "timeOut",
					"value": true
				}
			],
			"map_all_data": true,
			"source": "Wait for new movie or grid square",
			"target": "Set Request Status"
		},
		{
			"conditions": [
				{
					"source_output": "timeOut",
					"value": false
				}
			],
			"map_all_data": true,
			"source": "Wait for new movie or grid square",
			"target": "Get grid square lists"
		},
		{
			"map_all_data": true,
			"source": "Launch movie processing",
			"target": "Get grid square lists"
		}
	],
	"nodes": [
		{
			"id": "Init grid processing",
			"label": "Init grid processing",
			"task_identifier": "mx.src.cryoemInitGridProcess.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 264,
					"y": 280
				}
			}
		},
		{
			"id": "Set Request Status",
			"label": "Set Request Status",
			"task_identifier": "mx.src.requestStatusFINISHED.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 1877,
					"y": 380
				}
			}
		},
		{
			"id": "Get grid square lists",
			"label": "Get grid square lists",
			"task_identifier": "mx.src.cryoemInitGridSquareLists.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 612,
					"y": 280
				}
			}
		},
		{
			"id": "Process grid",
			"label": "Process grid",
			"task_identifier": "mx.src.cryoemProcessGridSquare.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 1078,
					"y": 192
				}
			}
		},
		{
			"id": "Wait for new movie or grid square",
			"label": "Wait for new movie or grid square",
			"task_identifier": "mx.src.cryoemWaitForNewMovieOrGridSquare.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 1417,
					"y": 330
				}
			}
		},
		{
			"id": "Launch movie processing",
			"label": "Launch movie processing",
			"task_identifier": "mx.src.cryoemLaunchMovieProcessing.run",
			"task_type": "ppfmethod",
			"uiProps": {
				"position": {
					"x": 1667,
					"y": 204
				}
			}
		}
	]
}

{
  "graph": {
    "id": "CryoEMProcessGrid.json",
    "input_nodes": [
      {
        "id": "Start",
        "node": "Init grid processing"
      }
    ],
    "label": "CryoEMProcessGrid",
    "output_nodes": [
      {
        "id": "Stop actor",
        "node": "Set Request Status"
      }
    ],
    "uiProps": {}
  },
  "links": [
    {
      "map_all_data": true,
      "source": "Init grid processing",
      "target": "Get grid square lists"
    },
    {
      "conditions": [
        {
          "source_output": "doProcessGridSquare",
          "value": true
        }
      ],
      "map_all_data": true,
      "source": "Get grid square lists",
      "target": "Process grid"
    },
    {
      "conditions": [
        {
          "source_output": "doProcessGridSquare",
          "value": false
        }
      ],
      "map_all_data": true,
      "source": "Get grid square lists",
      "target": "Wait for new movie or grid square"
    },
    {
      "conditions": [
        {
          "source_output": "doProcessMovie",
          "value": true
        }
      ],
      "map_all_data": true,
      "source": "Process grid",
      "target": "Launch movie processing"
    },
    {
      "conditions": [
        {
          "source_output": "doProcessMovie",
          "value": false
        }
      ],
      "map_all_data": true,
      "source": "Process grid",
      "target": "Wait for new movie or grid square"
    },
    {
      "conditions": [
        {
          "source_output": "timeOut",
          "value": true
        }
      ],
      "map_all_data": true,
      "source": "Wait for new movie or grid square",
      "target": "Set Request Status"
    },
    {
      "conditions": [
        {
          "source_output": "timeOut",
          "value": false
        }
      ],
      "map_all_data": true,
      "source": "Wait for new movie or grid square",
      "target": "Get grid square lists"
    },
    {
      "map_all_data": true,
      "source": "Launch movie processing",
      "target": "Get grid square lists"
    }
  ],
  "nodes": [
    {
      "id": "Init grid processing",
      "label": "Init grid processing",
      "task_identifier": "mx.src.cryoemInitGridProcess.run",
      "task_type": "ppfmethod",
      "uiProps": {
        "position": {
          "x": 264,
          "y": 280
        }
      }
    },
    {
      "id": "Set Request Status",
      "label": "Set Request Status",
      "task_identifier": "mx.src.requestStatusFINISHED.run",
      "task_type": "ppfmethod",
      "uiProps": {
        "position": {
          "x": 1877,
          "y": 380
        }
      }
    },
    {
      "id": "Get grid square lists",
      "label": "Get grid square lists",
      "task_identifier": "mx.src.cryoemInitGridSquareLists.run",
      "task_type": "ppfmethod",
      "uiProps": {
        "position": {
          "x": 612,
          "y": 280
        }
      }
    },
    {
      "id": "Process grid",
      "label": "Process grid",
      "task_identifier": "mx.src.cryoemProcessGridSquare.run",
      "task_type": "ppfmethod",
      "uiProps": {
        "position": {
          "x": 1078,
          "y": 192
        }
      }
    },
    {
      "id": "Wait for new movie or grid square",
      "label": "Wait for new movie or grid square",
      "task_identifier": "mx.src.cryoemWaitForNewMovieOrGridSquare.run",
      "task_type": "ppfmethod",
      "uiProps": {
        "position": {
          "x": 1417,
          "y": 330
        }
      }
    },
    {
      "id": "Launch movie processing",
      "label": "Launch movie processing",
      "task_identifier": "mx.src.cryoemLaunchMovieProcessing.run",
      "task_type": "ppfmethod",
      "uiProps": {
        "position": {
          "x": 1667,
          "y": 204
        }
      }
    }
  ]
}
