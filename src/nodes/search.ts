// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";

// This defines your new type of node.
export type SearchPluginNode = ChartNode<
  "searchPlugin",
  SearchPluginNodeData
>;

// This defines the data that your new node will store.
export type SearchPluginNodeData = {
  searchQuery: string;

  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSearchQueryInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function searchPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const SearchPluginNodeImpl: PluginNodeImpl<SearchPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): SearchPluginNode {
      const node: SearchPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          searchQuery: "Whats new in AI?",
        },

        // This is the default title of your node.
        title: "Google Search Node",

        // This must match the type of your node.
        type: "searchPlugin",

        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200,
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: SearchPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSearchQueryInput) {
        inputs.push({
          id: "searchQuery" as PortId,
          dataType: "string",
          title: "Search Query",
        });
      }
console.log({THEINPUTS: inputs});

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: SearchPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "resultsFormatted" as PortId,
          dataType: "string",
          title: "Results String",
        },
        {
          id: "resultsArray" as PortId,
          dataType: "string[]",
          title: "Results Array",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Google Search",
        group: "Research API",
        infoBoxBody: "This is an search plugin node.",
        infoBoxTitle: "Google Search Node",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: SearchPluginNodeData
    ): EditorDefinition<SearchPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "searchQuery",
          useInputToggleDataKey: "useSearchQueryInput",
          label: "Search Query",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: SearchPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Google Search Node
        Data: ${data.useSearchQueryInput ? "(Using Input)" : data.searchQuery}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: SearchPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const searchQuery = rivet.getInputOrData(
        data,
        inputData,
        "searchQuery",
        "string"
      );
      console.log({searchQuery, data})
      const baseURL = _context.getPluginConfig('baseURL') || `http://localhost:4030`;
      const urlString = `${baseURL}/www/search?query=${searchQuery}`
      console.log({urlString});
      
      const response = await fetch(urlString);
      const json = await response.json();
      console.log(json);
      return {
        ["resultsFormatted" as PortId]: {
          type: "string",
          value: json.string,
        },
        ["resultsArray" as PortId]: {
          type: "object[]",
          value: json.array,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const searchPluginNode = rivet.pluginNodeDefinition(
    SearchPluginNodeImpl,
    "Google Search"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return searchPluginNode;
}
