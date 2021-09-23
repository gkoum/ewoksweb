/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable unicorn/consistent-function-scoping */
import Dashboard from './layout/Dashboard';
import Dashboard1 from './layout/Dashboard1';

function App() {
  // const classes = useStyles();
  // const { fitView } = useZoomPanHelper();
  // const [rfInstance, setRfInstance] = useState(null);
  // const [elementClicked, setElementClicked] = useState({ id: 'none' });
  // // const [ewoksD, setEwoksD] = useState(ewoksNetwork);
  // const [disableDragging, setDisableDragging] = useState(false);
  // const [elements, setElements] = useState([]);
  // const reactFlowWrapper = useRef(null);

  // const ewoksElements = useStore((state) => {
  //   console.log(state);
  //   return state.ewoksElements;
  // });
  // const setEwoksElements = useStore((state) => state.setEwoksElements);

  // useEffect(() => {
  //   console.log(ewoksElements);
  //   setElements(ewoksElements);
  // }, [ewoksElements]);

  // const selectedElement = useStore((state) => state.selectedElement);
  // const setSelectedElement = useStore((state) => state.setSelectedElement);

  // const onElementClick = (event: MouseEvent, element: Node | Edge) => {
  //   console.log(element);
  //   const ewoksElement = ewoksElements.find((el) => el.id === element.id);
  //   setElementClicked(ewoksElement);
  //   setSelectedElement(ewoksElement);
  // };

  // const onLoad = (reactFlowInstance) => setRfInstance(reactFlowInstance);
  // const logToObject = () => console.log(rfInstance.toObject());
  // // const logToObject = (findGraphWithName> el.position)
  //     .map(({ id, data, type }) => ({
  //       id,
  //       task_identifier: data,
  //       inputs: 'ok',
  //       type,
  //     }));
  //   const links = elements
  //     .filter((el: Edge) => el.source)
  //     .map(({ id, source, target }) => ({
  //       id,
  //       source,
  //       target,
  //       inputs: 'ok',
  //     }));
  //   console.log({ nodes, links });
  //   return { nodes, links };
  //   // return { nodes: nodes, links: links };
  // };

  // useEffect(() => {
  //   fitView();
  // }, [fitView]);

  // const onDragOver = (event) => {
  //   event.preventDefault();
  //   event.dataTransfer.dropEffect = 'move';
  // };

  // const CustomNewNode = (id: number, name: string, image: string) => {
  //   return (
  //     <CustomNode
  //       id={id}
  //       name={name}
  //       image={image}
  //       onElementClick={onElementClick}
  //       // removeNode={removeNode}
  //       // openContactDetails={openContactDetails}
  //     />
  //   );
  // };

  // const onDrop = (event) => {
  //   event.preventDefault();
  //   console.log(event);
  //   const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
  //   const type = event.dataTransfer.getData('application/reactflow');
  //   console.log(type);
  //   const name = event.dataTransfer.getData('name');
  //   const image = event.dataTransfer.getData('image');
  //   const position = rfInstance.project({
  //     x: event.clientX - reactFlowBounds.left,
  //     y: event.clientY - reactFlowBounds.top,
  //   });
  //   const newNode = {
  //     id: getId(),
  //     type,
  //     position,
  //     data: { label: CustomNewNode(id, name, image) },
  //   };
  //   console.log(rfInstance);
  //   // setElements((es) => [...es, newNode]);
  //   setEwoksElements([...elements, newNode]);
  // };

  // const onConnect = (params) => {
  //   console.log(params);
  //   setElements((els) => addEdge(params, els));
  // };

  // const onRightClick = (event) => {
  //   event.preventDefault();
  //   console.log(event);
  // };

  // const onNodeDoubleClick = (event, node) => {
  //   event.preventDefault();
  //   console.log(event, node);
  //   if (node.type === 'graph') {
  //     const subgraph = findGraphWithName(node.data.task_identifier);
  //     console.log('THIS IS A GRAPH');
  //     console.log(subgraph);
  //   } else {
  //     console.log('THIS IS A NODE');
  //   }
  // };

  // const onAddRJson = (event) => {
  //   console.log(event);
  //   setElements((es) => event.updated_src);
  //   setEwoksD((es) => toEwoksObject(event.updated_src));
  // };

  // const onAddRJsonEwoks = (event) => {
  //   console.log(event);
  //   setEwoksD((es) => event.updated_src);
  // };

  // const onEditRJson = (event) => {
  //   console.log(event);
  //   setElements((es) => event.updated_src);
  //   setEwoksD(() => toEwoksObject(event.updated_src));
  // };

  // const onEditRJsonEwoks = (event) => {
  //   console.log(event);
  //   setEwoksD((es) => event.updated_src);
  // };

  // const handlDisableDragging = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDisableDragging(event.target.checked);
  // };

  // console.log(ewoksElements);

  return (
    <div>
      {/* <SideMenu /> */}
      <Dashboard1 />
      {/* <Dashboard /> */}
      {/* <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 500,
          y: 500,
          width: 800,
          height: 300,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            // onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
          <Icon className="fa fa-plus-circle" style={{ fontSize: 30 }} />
        </Toolbar>
        <Flow />
      </Rnd> */}
      {/* <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 100,
          y: 100,
          width: 1000,
          height: 800,
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" noWrap>
              Graphs Name
            </Typography>
            <Checkbox
              checked={disableDragging}
              onChange={handlDisableDragging}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </Toolbar>
        </AppBar>
        <ReactFlowProvider>
          <div
            className="reactflow-wrapper"
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#e9ebf7',
            }}
            ref={reactFlowWrapper}
          >
            <ReactFlow
              snapToGrid
              elements={elements}
              onElementClick={onElementClick}
              onLoad={onLoad}
              onDrop={onDrop}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onPaneContextMenu={onRightClick}
              onNodeDoubleClick={onNodeDoubleClick}
              nodeTypes={nodeTypes}
            >
              <Controls />
              <div
                style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}
              >
                <button type="button" onClick={logToObject}>
                  toObject
                </button>
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(elements)
                  )}`}
                  download="filename.json"
                >
                  Download Json
                </a>
              </div>
              <Background />
            </ReactFlow>
            <Popover
              anchor={elementClicked || null}
              onClose={() => setElementClicked(null)}
              nodeData={elementClicked || null}
              onBottom={true}
            />
          </div>
        </ReactFlowProvider>
      </Rnd> */}
      {/* <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 10,
          y: 70,
          width: 300,
          height: 300,
        }}
      > */}
      {/* <MyCard /> */}
      {/* </Rnd> */}
      {/* <ReactJson
        src={elements}
        collapseStringsAfterLength={15}
        onAdd={(e) => {
          onAddRJson(e);
        }}
        onEdit={(e) => {
          onEditRJson(e);
        }}
      />
      <ReactJson
        src={ewoksD}
        collapseStringsAfterLength={15}
        onAdd={(e) => {
          onAddRJsonEwoks(e);
        }}
        onEdit={(e) => {
          onEditRJsonEwoks(e);
        }}
      /> */}
    </div>
  );
}

export default App;
