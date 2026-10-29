import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Pi has no portable plugin format for MCP servers, so this extension registers the
// hosted Hype Doc server for the session. A "hypedoc" entry in mcp.json takes precedence.
// Six small tools, so expose them directly instead of behind codemode.
export default function (pi: ExtensionAPI) {
  pi.registerMcpServer("hypedoc", {
    url: "https://app.myhypedoc.com/mcp",
    description: "Log your wins and read them back for reviews and status updates",
    exposure: "direct",
  });
}
