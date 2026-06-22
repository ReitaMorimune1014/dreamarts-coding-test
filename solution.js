const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

const edges = [];

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  const parts = trimmed.split(',').map((s) => s.trim());
  if (parts.length < 3) return;

  const from = parseInt(parts[0], 10);
  const to   = parseInt(parts[1], 10);
  const dist = parseFloat(parts[2]);

  if (isNaN(from) || isNaN(to) || isNaN(dist)) return;
  edges.push({ from, to, dist });
});

rl.on('close', () => {
  const graph = new Map();

  const addEdge = (from, to, dist) => {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push({ node: to, dist });
  };

  for (const { from, to, dist } of edges) {
    addEdge(from, to, dist);
    addEdge(to, from, dist);
  }

  const nodes = [...graph.keys()];

  let maxDist  = -Infinity;
  let bestPath = [];

  const visited     = new Set();
  const currentPath = [];

  function dfs(node, totalDist) {
    if (totalDist > maxDist) {
      maxDist  = totalDist;
      bestPath = [...currentPath];
    }

    const neighbors = graph.get(node) ?? [];
    for (const { node: next, dist } of neighbors) {
      if (visited.has(next)) continue;

      visited.add(next);
      currentPath.push(next);

      dfs(next, totalDist + dist);

      currentPath.pop();
      visited.delete(next);
    }
  }

  for (const start of nodes) {
    visited.clear();
    visited.add(start);
    currentPath.length = 0;
    currentPath.push(start);

    dfs(start, 0);
  }

  process.stdout.write(bestPath.join('\r\n') + '\r\n');
});
