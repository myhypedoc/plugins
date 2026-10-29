# Hype Doc plugins

[Hype Doc](https://myhypedoc.com) keeps your wins in one place. This repository adds it to your AI coding tool: the hosted MCP server, plus skills that teach the tool when and how to log and review wins.

You sign in to Hype Doc in your browser the first time the tool connects. Nothing in this repository holds credentials.

## Install

| Tool | Command |
| --- | --- |
| Claude Code | `claude plugin marketplace add myhypedoc/plugins`<br>`claude plugin install hypedoc@myhypedoc` |
| OMP | `omp plugin marketplace add myhypedoc/plugins`<br>`omp plugin install hypedoc@myhypedoc` |
| Pi | `pi install git:github.com/myhypedoc/plugins` |
| Codex | `codex plugin marketplace add myhypedoc/plugins` |
| GitHub Copilot in VS Code | Add `myhypedoc/plugins` to the `chat.plugins.marketplaces` setting, then install **hypedoc** from the Agent Customizations editor |
| GitHub Copilot CLI | `/plugin marketplace add myhypedoc/plugins`, then `/plugin install hypedoc@myhypedoc` |

For Cursor, ChatGPT, Claude Desktop, and OpenCode, follow the [MCP setup guides](https://docs.myhypedoc.com/mcp/). They connect the same server without a plugin.

After installing, ask your tool to log a win, or run one of the skills below. The first call opens your browser to sign in.

## Skills

| Skill | Use it to |
| --- | --- |
| `log-win` | Log something you just finished, in the right space |
| `draft-review` | Draft a self-review, promotion case, or resume bullets from your wins |
| `weekly-update` | Turn the last week or two of wins into a short status update |
| `find-wins` | Search past wins by topic, tag, space, or date |

Claude Code, Cursor, and VS Code also run skills as slash commands, for example `/hypedoc:log-win`.

## What is in here

```
plugins/hypedoc/     The plugin: plugin.json, mcp.json, skills/
pi/                  Pi extension that registers the MCP server
.claude-plugin/      Marketplace catalog for Claude Code, OMP, and VS Code
.cursor-plugin/      Marketplace catalog for Cursor
.agents/plugins/     Marketplace catalog for Codex
```

The plugin follows the [Agent Plugins](https://agent-plugins.org) standard, so tools that support it can load `plugins/hypedoc` directly. Claude Code and Cursor also get a small manifest of their own. Pi does not support the standard, so it has its own extension.

## Development

```bash
node scripts/validate.mjs          # manifests, versions, skills, tool names
node scripts/validate.mjs --live   # also checks the hosted MCP endpoint
claude plugin validate . --strict
```

When you change the plugin, bump `version` in `plugins/hypedoc/plugin.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and `package.json`. The validator fails if they disagree. Claude Code ignores updates that do not change the version. Never rename the plugin: installs are tracked by name.

## License

MIT
