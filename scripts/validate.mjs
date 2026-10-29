// Checks the repo without any dependencies. Run `node scripts/validate.mjs`,
// or add --live to also probe the hosted MCP endpoint.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const PLUGIN = "plugins/hypedoc";
const MCP_URL = "https://app.myhypedoc.com/mcp";
// Keep in sync with the server's tool list (server/src/controllers/mcp.rs in myhypedoc/myhypedoc).
const TOOLS = new Set(["log_win", "list_wins", "list_spaces", "create_space", "list_tags", "export_wins"]);
const MANIFEST_KEYS = new Set(["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"]);

const errors = [];
const fail = (message) => errors.push(message);
const json = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${path}: ${error.message}`);
    return {};
  }
};

const manifest = json(join(PLUGIN, "plugin.json"));
for (const key of Object.keys(manifest)) {
  if (!MANIFEST_KEYS.has(key)) fail(`${PLUGIN}/plugin.json: unknown field "${key}"`);
}
if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(manifest.name ?? "") || /--|\.\./.test(manifest.name)) {
  fail(`${PLUGIN}/plugin.json: invalid name "${manifest.name}"`);
}

// Every manifest must agree on identity.
const copies = {
  [`${PLUGIN}/.claude-plugin/plugin.json`]: json(join(PLUGIN, ".claude-plugin/plugin.json")),
  [`${PLUGIN}/.cursor-plugin/plugin.json`]: json(join(PLUGIN, ".cursor-plugin/plugin.json")),
};
for (const [path, copy] of Object.entries(copies)) {
  for (const key of ["name", "version", "description"]) {
    if (copy[key] !== manifest[key]) fail(`${path}: ${key} differs from plugin.json`);
  }
}
const pkg = json("package.json");
if (pkg.version !== manifest.version) fail("package.json: version differs from plugin.json");

// MCP config.
const mcp = json(join(PLUGIN, "mcp.json"));
if (mcp.mcpServers?.hypedoc?.url !== MCP_URL) fail(`${PLUGIN}/mcp.json: hypedoc server must point at ${MCP_URL}`);
if (copies[`${PLUGIN}/.claude-plugin/plugin.json`].mcpServers !== "./mcp.json") {
  fail("Claude Code only reads .mcp.json, so .claude-plugin/plugin.json must set mcpServers to ./mcp.json");
}
if (!readFileSync("pi/extension.ts", "utf8").includes(MCP_URL)) fail(`pi/extension.ts: must register ${MCP_URL}`);

// Marketplace catalogs.
for (const path of [".claude-plugin/marketplace.json", ".cursor-plugin/marketplace.json", ".agents/plugins/marketplace.json"]) {
  const catalog = json(path);
  if (catalog.name !== "myhypedoc") fail(`${path}: marketplace name must be myhypedoc`);
  const entry = (catalog.plugins ?? []).find((plugin) => plugin.name === manifest.name);
  if (!entry) {
    fail(`${path}: no entry for ${manifest.name}`);
    continue;
  }
  const source = typeof entry.source === "string" ? entry.source : entry.source?.path;
  if (!source || !existsSync(join(source.replace(/^\.\//, ""), "plugin.json"))) fail(`${path}: source "${source}" is not a plugin directory`);
}

// Skills.
const skillsDir = join(PLUGIN, "skills");
for (const dir of readdirSync(skillsDir)) {
  const file = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(file)) {
    fail(`${file}: missing`);
    continue;
  }
  const text = readFileSync(file, "utf8");
  const front = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const name = front.match(/^name:\s*(.+)$/m)?.[1].trim();
  const description = front.match(/^description:\s*(.+)$/m)?.[1].trim();
  if (name !== dir) fail(`${file}: name "${name}" must match directory "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name ?? "") || name.length > 64) fail(`${file}: invalid name`);
  if (!description || description.length > 1024) fail(`${file}: description missing or over 1024 characters`);
  if (text.includes("—")) fail(`${file}: avoid em dashes`);
  const used = text.match(/Use the Hype Doc MCP tools (.+)\./)?.[1].match(/`([a-z_]+)`/g) ?? [];
  if (used.length === 0) fail(`${file}: must name the MCP tools it uses on a "Use the Hype Doc MCP tools" line`);
  for (const tool of used.map((name) => name.replaceAll("`", ""))) {
    if (!TOOLS.has(tool)) fail(`${file}: unknown tool "${tool}"`);
  }
}

// The hosted endpoint must be reachable and discoverable. It needs no credentials.
if (process.argv.includes("--live")) {
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
  });
  const challenge = response.headers.get("www-authenticate") ?? "";
  if (response.status !== 401 || !challenge.includes("resource_metadata")) {
    fail(`${MCP_URL}: expected 401 with a resource_metadata challenge, got ${response.status} "${challenge}"`);
  }
  const metadata = await (await fetch("https://app.myhypedoc.com/.well-known/oauth-protected-resource")).json();
  if (metadata.resource !== MCP_URL) fail(`protected resource metadata names ${metadata.resource}`);
}

if (errors.length > 0) {
  console.error(errors.map((message) => `- ${message}`).join("\n"));
  process.exit(1);
}
console.log("ok");
