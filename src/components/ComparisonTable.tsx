import { motion } from 'motion/react';

interface ComparisonTableProps {
  negativeWeightMode?: boolean;
}

export function ComparisonTable({ negativeWeightMode = false }: ComparisonTableProps) {
  const rows = [
    {
      feature: 'Algorithm Type',
      dijkstra: 'Greedy',
      bellmanFord: 'Dynamic Programming – Iterative',
    },
    {
      feature: 'Node Visitation Strategy',
      dijkstra: 'Each node visited once, based on minimum distance',
      bellmanFord: 'Multiple times, via edge relaxation',
    },
    {
      feature: 'Edge Relaxation Strategy',
      dijkstra: 'Only neighbors of current node',
      bellmanFord: 'All edges in each iteration',
    },
    {
      feature: 'Handling Negative Weights',
      dijkstra: 'Cannot handle',
      bellmanFord: 'Can handle, detects negative cycles',
    },
    {
      feature: 'Time Complexity',
      dijkstra: 'O((V+E) log V) with priority queue',
      bellmanFord: 'O(V×E)',
    },
    {
      feature: 'Space Complexity',
      dijkstra: 'O(V)',
      bellmanFord: 'O(V)',
    },
    {
      feature: 'Iterative Nature',
      dijkstra: 'Single pass through nodes',
      bellmanFord: 'n-1 iterations guaranteed',
    },
    {
      feature: 'Accuracy Conditions',
      dijkstra: 'All positive weights required',
      bellmanFord: 'Works with negative weights if no negative cycle',
    },
  ];

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-8 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-white mb-6 text-center">Scientific Algorithm Comparison</h3>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-700">
              <th className="text-left py-4 px-4 text-gray-300 w-1/4">Feature</th>
              <th className="text-left py-4 px-4 text-orange-400 w-3/8">Dijkstra&apos;s Algorithm</th>
              <th className="text-left py-4 px-4 text-purple-400 w-3/8">Bellman–Ford Algorithm</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <motion.tr
                key={index}
                className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <td className="py-4 px-4 text-gray-300">{row.feature}</td>
                <td className="py-4 px-4 text-gray-200">{row.dijkstra}</td>
                <td className="py-4 px-4 text-gray-200">{row.bellmanFord}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pseudocode Section */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* Dijkstra Pseudocode */}
        <div className="bg-gray-900 rounded-lg p-6 border border-orange-500/30">
          <h4 className="text-orange-400 mb-4">Dijkstra&apos;s Algorithm Pseudocode</h4>
          <pre className="text-sm text-gray-300 leading-relaxed overflow-x-auto">
            <code>{`dist = {node: inf for node in graph}
dist[source] = 0
visited = set()

while len(visited) < n:
    u = node with smallest dist[u] not in visited
    visited.add(u)
    for neighbor v of u:
        if dist[v] > dist[u] + weight(u,v):
            dist[v] = dist[u] + weight(u,v)`}</code>
          </pre>
        </div>

        {/* Bellman-Ford Pseudocode */}
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-500/30">
          <h4 className="text-purple-400 mb-4">Bellman–Ford Algorithm Pseudocode</h4>
          <pre className="text-sm text-gray-300 leading-relaxed overflow-x-auto">
            <code>{`dist = {node: inf for node in graph}
dist[source] = 0

for i in range(n-1):
    for u, v, w in edges:
        if dist[v] > dist[u] + w:
            dist[v] = dist[u] + w`}</code>
          </pre>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-blue-400">Key Insight:</span> Dijkstra&apos;s greedy approach is faster but requires all edges to have positive weights, 
          while Bellman–Ford&apos;s dynamic programming approach is more flexible, handling negative weights and detecting negative cycles 
          through systematic iteration over all edges.
        </p>
      </div>

      {/* Behavior with Negative Weights */}
      <div className="mt-8">
        <h4 className="text-white mb-4">Behavior with Negative Weights</h4>
        <div className="grid grid-cols-2 gap-6">
          {/* Dijkstra */}
          <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-6">
            <h5 className="text-orange-400 mb-3">Dijkstra&apos;s Algorithm</h5>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-red-300 mb-1">Result</div>
                <div className="text-gray-200">Stops computing when negative edge detected</div>
              </div>
              <div>
                <div className="text-sm text-red-300 mb-1">Reason</div>
                <div className="text-xs text-gray-300 leading-relaxed">
                  The greedy approach assumes all edge weights are non-negative. When a negative edge is encountered,
                  the algorithm cannot guarantee correctness and stops. Remaining nodes stay at ∞.
                </div>
              </div>
              <div>
                <div className="text-sm text-red-300 mb-1">Visualization Output</div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-xs text-gray-300">Stops at negative edge, incomplete result</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bellman-Ford */}
          <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-6">
            <h5 className="text-purple-400 mb-3">Bellman–Ford Algorithm</h5>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-green-300 mb-1">Result</div>
                <div className="text-gray-200">Computes correct shortest paths</div>
              </div>
              <div>
                <div className="text-sm text-green-300 mb-1">Reason</div>
                <div className="text-xs text-gray-300 leading-relaxed">
                  Systematic edge relaxation over {negativeWeightMode ? '5' : 'n-1'} iterations ensures all shortest paths are found, 
                  even with negative weights. Distances improve across iterations until stabilization.
                </div>
              </div>
              <div>
                <div className="text-sm text-green-300 mb-1">Visualization Output</div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-xs text-gray-300">Complete correct distances for all nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}