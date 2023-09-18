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
export type webscraperPluginNode = ChartNode<
  "webscraperPlugin",
  webscraperPluginNodeData
>;

// This defines the data that your new node will store.
export type webscraperPluginNodeData = {
  url: string;

  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useURLInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function webscraperPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const webscraperPluginNodeImpl: PluginNodeImpl<webscraperPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): webscraperPluginNode {
      const node: webscraperPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          url: "https://github.com/hushaudio",
        },

        // This is the default title of your node.
        title: "Webscraper Node",

        // This must match the type of your node.
        type: "webscraperPlugin",

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
      data: webscraperPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useURLInput) {
        inputs.push({
          id: "url" as PortId,
          dataType: "string",
          title: "URL",
        });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: webscraperPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "url" as PortId,
          dataType: "string",
          title: "URL",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Webscraper Plugin",
        group: "Research API",
        infoBoxBody: "This is an Webscraper Node.",
        infoBoxTitle: "Webscraper Node",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: webscraperPluginNodeData
    ): EditorDefinition<webscraperPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "url",
          useInputToggleDataKey: "useURLInput",
          label: "URL",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: webscraperPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Webscraper Node
        Data: ${data.useURLInput ? "(Using Input)" : data.url}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: webscraperPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const url = rivet.getInputOrData(
        data,
        inputData,
        "url",
        "string"
      );

      const baseURL = _context.getPluginConfig('baseURL') || `http://localhost:4030`;
      const urlString = `${baseURL}/www/scrape?url=${url}`
      const response = await fetch(urlString);
      const json = await response.json();
      console.log(json);
      return {
        ["url" as PortId]: {
          type: "string",
          value: json,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const webscraperPluginNode = rivet.pluginNodeDefinition(
    webscraperPluginNodeImpl,
    "Webscraper"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return webscraperPluginNode;
}
