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
export type RemDupePluginNode = ChartNode<
  "remDupePlugin",
  RemDupePluginNodeData
>;

// This defines the data that your new node will store.
export type RemDupePluginNodeData = {
  someString: string;
  separator: string;

  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeStringInput?: boolean;
  useSeparatorInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function remDupePluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const RemDupePluginNodeImpl: PluginNodeImpl<RemDupePluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): RemDupePluginNode {
      const node: RemDupePluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          someString: "Hello World, hello world.  Hello world.\nHello World, hello world.  Hello world.\nHello World, hello world.  Hello world.",
          separator: "."
        },

        // This is the default title of your node.
        title: "Remove Duplicates by Separator",

        // This must match the type of your node.
        type: "remDupePlugin",

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
      data: RemDupePluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeStringInput) {
        inputs.push({
          id: "someString" as PortId,
          dataType: "string",
          title: "Some String",
        });
      }

      if (data.useSeparatorInput) {
        inputs.push({
          id: "separator" as PortId,
          dataType: "string",
          title: "Separator",
        });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: RemDupePluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "cleaned" as PortId,
          dataType: "string",
          title: "Cleaned String",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Remove Dupe Text",
        group: "Research API",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Remove Duplicates by Separator",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: RemDupePluginNodeData
    ): EditorDefinition<RemDupePluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "someString",
          useInputToggleDataKey: "useSomeStringInput",
          label: "Some String",
        },
        {
          type: "string",
          dataKey: "separator",
          useInputToggleDataKey: "useSeparatorInput",
          label: "Separator",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: RemDupePluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Remove Duplicates by Separator
        Data: ${data.useSomeStringInput ? "(Using Input)" : data.someString}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: RemDupePluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const someString = rivet.getInputOrData(
        data,
        inputData,
        "someString",
        "string"
      );

      const separator = rivet.getInputOrData(
        data,
        inputData,
        "separator",
        "string"
      );

      return {
        ["cleaned" as PortId]: {
          type: "string",
          value: removeDuplicateText(someString, separator),
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const remDupePluginNode = rivet.pluginNodeDefinition(
    RemDupePluginNodeImpl,
    "Remove Duplicates by Separator"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return remDupePluginNode;
}

function removeDuplicateText(inputStr:string, sepeartor:string='.') {
  const seen = new Set();
  const sentences = inputStr.split(sepeartor).map(s => s.trim());

  const uniqueSentences = sentences.filter(sentence => {
    if (seen.has(sentence)) {
      return false;
    } else {
      seen.add(sentence);
      return true;
    }
  });

  return uniqueSentences.join('. ');
}
