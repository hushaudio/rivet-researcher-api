// src/nodes/search.ts
function searchPluginNode(rivet) {
  const SearchPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          searchQuery: "Whats new in AI?"
        },
        // This is the default title of your node.
        title: "Google Search Node",
        // This must match the type of your node.
        type: "searchPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSearchQueryInput) {
        inputs.push({
          id: "searchQuery",
          dataType: "string",
          title: "Search Query"
        });
      }
      console.log({ THEINPUTS: inputs });
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "resultsFormatted",
          dataType: "string",
          title: "Results String"
        },
        {
          id: "resultsArray",
          dataType: "string[]",
          title: "Results Array"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Google Search",
        group: "Research API",
        infoBoxBody: "This is an search plugin node.",
        infoBoxTitle: "Google Search Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "searchQuery",
          useInputToggleDataKey: "useSearchQueryInput",
          label: "Search Query"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Google Search Node
        Data: ${data.useSearchQueryInput ? "(Using Input)" : data.searchQuery}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const searchQuery = rivet.getInputOrData(
        data,
        inputData,
        "searchQuery",
        "string"
      );
      console.log({ searchQuery, data });
      const baseURL = _context.getPluginConfig("baseURL") || `http://localhost:4030`;
      const urlString = `${baseURL}/www/search?query=${searchQuery}`;
      console.log({ urlString });
      const response = await fetch(urlString);
      const json = await response.json();
      console.log(json);
      return {
        ["resultsFormatted"]: {
          type: "string",
          value: json.string
        },
        ["resultsArray"]: {
          type: "object[]",
          value: json.array
        }
      };
    }
  };
  const searchPluginNode2 = rivet.pluginNodeDefinition(
    SearchPluginNodeImpl,
    "Google Search"
  );
  return searchPluginNode2;
}

// src/nodes/scrape.ts
function webscraperPluginNode(rivet) {
  const webscraperPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          url: "https://github.com/hushaudio"
        },
        // This is the default title of your node.
        title: "Webscraper Node",
        // This must match the type of your node.
        type: "webscraperPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useURLInput) {
        inputs.push({
          id: "url",
          dataType: "string",
          title: "URL"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "url",
          dataType: "string",
          title: "URL"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Webscraper Plugin",
        group: "Research API",
        infoBoxBody: "This is an Webscraper Node.",
        infoBoxTitle: "Webscraper Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "url",
          useInputToggleDataKey: "useURLInput",
          label: "URL"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Webscraper Node
        Data: ${data.useURLInput ? "(Using Input)" : data.url}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const url = rivet.getInputOrData(
        data,
        inputData,
        "url",
        "string"
      );
      const baseURL = _context.getPluginConfig("baseURL") || `http://localhost:4030`;
      const urlString = `${baseURL}/www/scrape?url=${url}`;
      const response = await fetch(urlString);
      const json = await response.json();
      console.log(json);
      return {
        ["url"]: {
          type: "string",
          value: json
        }
      };
    }
  };
  const webscraperPluginNode2 = rivet.pluginNodeDefinition(
    webscraperPluginNodeImpl,
    "Webscraper"
  );
  return webscraperPluginNode2;
}

// src/nodes/removeDuplicates.ts
function remDupePluginNode(rivet) {
  const RemDupePluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
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
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeStringInput) {
        inputs.push({
          id: "someString",
          dataType: "string",
          title: "Some String"
        });
      }
      if (data.useSeparatorInput) {
        inputs.push({
          id: "separator",
          dataType: "string",
          title: "Separator"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "cleaned",
          dataType: "string",
          title: "Cleaned String"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Remove Dupe Text",
        group: "Research API",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Remove Duplicates by Separator"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someString",
          useInputToggleDataKey: "useSomeStringInput",
          label: "Some String"
        },
        {
          type: "string",
          dataKey: "separator",
          useInputToggleDataKey: "useSeparatorInput",
          label: "Separator"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Remove Duplicates by Separator
        Data: ${data.useSomeStringInput ? "(Using Input)" : data.someString}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
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
        ["cleaned"]: {
          type: "string",
          value: removeDuplicateText(someString, separator)
        }
      };
    }
  };
  const remDupePluginNode2 = rivet.pluginNodeDefinition(
    RemDupePluginNodeImpl,
    "Remove Duplicates by Separator"
  );
  return remDupePluginNode2;
}
function removeDuplicateText(inputStr, sepeartor = ".") {
  const seen = /* @__PURE__ */ new Set();
  const sentences = inputStr.split(sepeartor).map((s) => s.trim());
  const uniqueSentences = sentences.filter((sentence) => {
    if (seen.has(sentence)) {
      return false;
    } else {
      seen.add(sentence);
      return true;
    }
  });
  return uniqueSentences.join(". ");
}

// src/index.ts
var plugin = (rivet) => {
  const googleNode = searchPluginNode(rivet);
  const webscraperNode = webscraperPluginNode(rivet);
  const remDupeNode = remDupePluginNode(rivet);
  const researchAPIPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "research-api-plugin",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Reasearch API Plugin",
    // Define all configuration settings in the configSpec object.
    configSpec: {
      baseURL: {
        type: "string",
        label: "Base URL",
        description: "Base URL for the research API. Defaults to localhost:4030.",
        helperText: "github.com/hushaudio"
      }
    },
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "reasearchAPI",
        label: "Research API"
      }
    ],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(googleNode);
      register(webscraperNode);
      register(remDupeNode);
    }
  };
  return researchAPIPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
