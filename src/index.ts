// It is important that you only import types from @ironclad/rivet-core, and not
// any of the actual Rivet code. Rivet is passed into the initializer function as
// a parameter, and you can use it to access any Rivet functionality you need.
import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";

import { searchPluginNode } from "./nodes/search";
import { webscraperPluginNode } from "./nodes/scrape";
import { remDupePluginNode } from "./nodes/removeDuplicates";

// A Rivet plugin must default export a plugin initializer function. This takes in the Rivet library as its
// only parameter. This function must return a valid RivetPlugin object.
const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const googleNode = searchPluginNode(rivet);
  const webscraperNode = webscraperPluginNode(rivet);
  const remDupeNode = remDupePluginNode(rivet);

  // The plugin object is the definition for your plugin.
  const researchAPIPlugin: RivetPlugin = {
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
        helperText: "github.com/hushaudio",
      },
    },

    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "reasearchAPI",
        label: "Research API",
      },
    ],

    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(googleNode);
      register(webscraperNode);
      register(remDupeNode);
    },
  };

  // Make sure to return your plugin definition.
  return researchAPIPlugin;
};

// Make sure to default export your plugin.
export default plugin;
