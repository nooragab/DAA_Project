import { motion } from 'motion/react';
import { GraphVisualization } from './GraphVisualization';
import { Graph } from '../types/graph';

interface AlgorithmPanelProps {
  title: string;
  subtitle: string;
  graph: Graph;
  distances: { [key: string]: number };
  currentNode: string | null;
  visitedNodes: Set<string>;
  highlightedEdge: { from: string; to: string } | null;
  currentStep: number;
  totalSteps: number;
  iteration?: number;
  isComplete: boolean;
  algorithmType: 'dijkstra' | 'bellman-ford';
  finalizedNodes: Set<string>;
  negativeWeightMode?: boolean;
  hasError?: boolean;
  incorrectNodes?: Set<string>;
  incorrectEdge?: { from: string; to: string } | null;
  hasNegativeCycle?: boolean;
}

export function AlgorithmPanel({
  title,
  subtitle,
  graph,
  distances,
  currentNode,
  visitedNodes,
  highlightedEdge,
  currentStep,
  totalSteps,
  iteration,
  isComplete,
  algorithmType,
  finalizedNodes,
  negativeWeightMode = false,
  hasError = false,
  incorrectNodes = new Set(),
  incorrectEdge = null,
  hasNegativeCycle = false,
}: AlgorithmPanelProps) {
  const accentColor = algorithmType === 'dijkstra' ? 'orange' : 'purple';
  const accentClass = algorithmType === 'dijkstra' ? 'text-orange-400' : 'text-purple-400';
  const borderClass = algorithmType === 'dijkstra' ? 'border-orange-500/30' : 'border-purple-500/30';

  return (
    <motion.div
      className={`relative bg-gray-800 rounded-lg p-6 border-2 ${borderClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Iteration Counter for Bellman-Ford - Above Panel */}
      {algorithmType === 'bellman-ford' && iteration > 0 && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 px-6 py-2 rounded-full shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={iteration}
        >
          <div className="text-white">
            Iteration {iteration} / {graph.nodes.length - 1}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-white mb-1 ${accentClass}`}>{title}</h2>
        <p className="text-gray-400">{subtitle}</p>
      </div>

      {/* Warning Banner for Dijkstra with negative weights */}
      {algorithmType === 'dijkstra' && negativeWeightMode && !isComplete && currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-900/30 border border-red-500/50 rounded-lg p-3"
        >
          <div className="flex items-start gap-2">
            <span className="text-red-400 text-lg">⚠</span>
            <div>
              <div className="text-sm text-red-200">Warning: Graph contains negative edges!</div>
              <div className="text-xs text-red-300 mt-1">
                Dijkstra will stop when it encounters a negative edge
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Graph Visualization */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <GraphVisualization
          graph={graph}
          distances={distances}
          currentNode={currentNode}
          visitedNodes={visitedNodes}
          highlightedEdge={highlightedEdge}
          algorithmType={algorithmType}
          finalizedNodes={finalizedNodes}
          hasError={hasError}
          incorrectNodes={incorrectNodes}
          incorrectEdge={incorrectEdge}
          hasNegativeCycle={hasNegativeCycle}
        />
      </div>

      {/* Progress Indicators */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">
            Step {currentStep} / {totalSteps}
          </span>
          {isComplete && (
            <motion.span
              className="text-green-400 flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span>Complete</span>
              <span>✓</span>
            </motion.span>
          )}
        </div>
        
        {algorithmType === 'bellman-ford' && iteration !== undefined && iteration > 0 && (
          <motion.div
            className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-sm text-purple-300">
              Iteration: <span className="text-purple-400">{iteration}</span> / {graph.nodes.length - 1}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Relaxing all edges systematically
            </div>
          </motion.div>
        )}
        
        {algorithmType === 'dijkstra' && currentNode && !isComplete && (
          <motion.div
            className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-sm text-yellow-300">
              Greedy Selection: <span className="text-yellow-400">{currentNode}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Visiting nearest unvisited node
            </div>
          </motion.div>
        )}
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={algorithmType === 'dijkstra' ? 'bg-orange-500 h-full rounded-full' : 'bg-purple-500 h-full rounded-full'}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Node Status Legend */}
        <div className="flex gap-4 text-xs pt-2 border-t border-gray-700">
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${algorithmType === 'dijkstra' ? 'bg-yellow-500' : 'bg-purple-500'}`} />
            <span className="text-gray-400">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400">
              {algorithmType === 'dijkstra' ? 'Finalized' : 'Stabilized'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-400">Visited</span>
          </div>
        </div>

        {/* Result Messages for Negative Weight Mode */}
        {negativeWeightMode && isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            {algorithmType === 'dijkstra' ? (
              <div className="bg-red-900/40 border border-red-500/60 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-xl">✗</span>
                  <div>
                    <div className="text-red-300">Algorithm Stopped - Incorrect Result</div>
                    <div className="text-xs text-gray-300 mt-1">
                      Dijkstra detected negative edge and stopped computing. Remaining nodes are unreachable (∞).
                    </div>
                    <div className="text-xs text-red-400 mt-2">
                      ⚠ Dijkstra cannot handle negative edge weights
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {hasNegativeCycle ? (
                  <div className="bg-red-900/40 border border-red-500/60 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 text-xl">⚠</span>
                      <div>
                        <div className="text-red-300">Negative Cycle Detected</div>
                        <div className="text-xs text-gray-300 mt-1">
                          Graph contains a negative cycle – shortest paths are undefined
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-900/40 border border-green-500/60 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 text-xl">✓</span>
                      <div>
                        <div className="text-green-300">Correct Result</div>
                        <div className="text-xs text-gray-300 mt-1">
                          Bellman–Ford successfully handles negative weights and computed correct distances after {graph.nodes.length - 1} iterations
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}