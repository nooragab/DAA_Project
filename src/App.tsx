import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import { AlgorithmPanel } from './components/AlgorithmPanel';
import { ComparisonTable } from './components/ComparisonTable';
import { createGraph, createNegativeWeightGraph } from './utils/graphData';
import { generateDijkstraSteps } from './utils/dijkstra';
import { generateBellmanFordSteps } from './utils/bellmanFord';
import { AlgorithmStep } from './types/graph';

export default function App() {
  const [negativeWeightMode, setNegativeWeightMode] = useState(false);
  const [graph, setGraph] = useState(() => createGraph());
  const [isRunning, setIsRunning] = useState(false);
  const [dijkstraSteps, setDijkstraSteps] = useState<AlgorithmStep[]>([]);
  const [bellmanFordSteps, setBellmanFordSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Dijkstra state
  const [dijkstraDistances, setDijkstraDistances] = useState<{ [key: string]: number }>({});
  const [dijkstraCurrentNode, setDijkstraCurrentNode] = useState<string | null>(null);
  const [dijkstraVisited, setDijkstraVisited] = useState<Set<string>>(new Set());
  const [dijkstraHighlightedEdge, setDijkstraHighlightedEdge] = useState<{ from: string; to: string } | null>(null);
  const [dijkstraComplete, setDijkstraComplete] = useState(false);
  const [dijkstraFinalized, setDijkstraFinalized] = useState<Set<string>>(new Set());

  // Bellman-Ford state
  const [bellmanFordDistances, setBellmanFordDistances] = useState<{ [key: string]: number }>({});
  const [bellmanFordCurrentNode, setBellmanFordCurrentNode] = useState<string | null>(null);
  const [bellmanFordVisited, setBellmanFordVisited] = useState<Set<string>>(new Set());
  const [bellmanFordHighlightedEdge, setBellmanFordHighlightedEdge] = useState<{ from: string; to: string } | null>(null);
  const [bellmanFordIteration, setBellmanFordIteration] = useState(0);
  const [bellmanFordComplete, setBellmanFordComplete] = useState(false);
  const [bellmanFordFinalized, setBellmanFordFinalized] = useState<Set<string>>(new Set());
  const [bellmanFordPreviousDistances, setBellmanFordPreviousDistances] = useState<{ [key: string]: number }>({});
  const [bellmanFordHasNegativeCycle, setBellmanFordHasNegativeCycle] = useState(false);

  // Dijkstra error tracking
  const [dijkstraHasError, setDijkstraHasError] = useState(false);
  const [dijkstraIncorrectNodes, setDijkstraIncorrectNodes] = useState<Set<string>>(new Set());
  const [dijkstraIncorrectEdge, setDijkstraIncorrectEdge] = useState<{ from: string; to: string } | null>(null);

  // Initialize distances
  useEffect(() => {
    const initialDistances: { [key: string]: number } = {};
    graph.nodes.forEach(node => {
      initialDistances[node.id] = node.id === 'A' ? 0 : Infinity;
    });
    setDijkstraDistances(initialDistances);
    setBellmanFordDistances(initialDistances);
  }, [graph]);

  const handleRunAlgorithms = () => {
    // Reset everything
    setCurrentStepIndex(0);
    setIsRunning(true);
    setDijkstraComplete(false);
    setBellmanFordComplete(false);
    setDijkstraVisited(new Set());
    setBellmanFordVisited(new Set());
    setDijkstraFinalized(new Set(['A'])); // Start node is immediately finalized
    setBellmanFordFinalized(new Set(['A'])); // Start node is also finalized
    setDijkstraCurrentNode(null);
    setBellmanFordCurrentNode(null);
    setDijkstraHighlightedEdge(null);
    setBellmanFordHighlightedEdge(null);
    setBellmanFordIteration(0);
    setBellmanFordHasNegativeCycle(false);
    setDijkstraHasError(false);
    setDijkstraIncorrectNodes(new Set());
    setDijkstraIncorrectEdge(null);

    // Generate steps
    const dSteps = generateDijkstraSteps(graph, 'A', negativeWeightMode);
    const bfSteps = generateBellmanFordSteps(graph, 'A');
    
    setDijkstraSteps(dSteps);
    setBellmanFordSteps(bfSteps);

    // Initialize distances
    const initialDistances: { [key: string]: number } = {};
    graph.nodes.forEach(node => {
      initialDistances[node.id] = node.id === 'A' ? 0 : Infinity;
    });
    setDijkstraDistances(initialDistances);
    setBellmanFordDistances(initialDistances);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setDijkstraSteps([]);
    setBellmanFordSteps([]);
    setDijkstraComplete(false);
    setBellmanFordComplete(false);
    setDijkstraVisited(new Set());
    setBellmanFordVisited(new Set());
    setDijkstraFinalized(new Set());
    setBellmanFordFinalized(new Set());
    setDijkstraCurrentNode(null);
    setBellmanFordCurrentNode(null);
    setDijkstraHighlightedEdge(null);
    setBellmanFordHighlightedEdge(null);
    setBellmanFordIteration(0);
    setBellmanFordHasNegativeCycle(false);
    setDijkstraHasError(false);
    setDijkstraIncorrectNodes(new Set());
    setDijkstraIncorrectEdge(null);

    const initialDistances: { [key: string]: number } = {};
    graph.nodes.forEach(node => {
      initialDistances[node.id] = node.id === 'A' ? 0 : Infinity;
    });
    setDijkstraDistances(initialDistances);
    setBellmanFordDistances(initialDistances);
  };

  // Animate steps
  useEffect(() => {
    if (!isRunning || dijkstraSteps.length === 0 || bellmanFordSteps.length === 0) return;

    const maxSteps = Math.max(dijkstraSteps.length, bellmanFordSteps.length);
    
    if (currentStepIndex >= maxSteps) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      // Process Dijkstra step
      if (currentStepIndex < dijkstraSteps.length) {
        const step = dijkstraSteps[currentStepIndex];
        
        if (step.type === 'visit') {
          setDijkstraCurrentNode(step.nodeId!);
          setDijkstraVisited(prev => new Set([...prev, step.nodeId!]));
          setDijkstraFinalized(prev => new Set([...prev, step.nodeId!])); // Finalize visited node
          setDijkstraHighlightedEdge(null);
          if (step.distances) {
            setDijkstraDistances(step.distances);
          }
          // Track incorrect nodes
          if (step.isIncorrect && step.nodeId) {
            setDijkstraIncorrectNodes(prev => new Set([...prev, step.nodeId!]));
          }
        } else if (step.type === 'relax') {
          setDijkstraHighlightedEdge({ from: step.edgeFrom!, to: step.edgeTo! });
          if (step.distances) {
            setDijkstraDistances(step.distances);
          }
          // Track incorrect relaxations
          if (step.isIncorrect) {
            setDijkstraIncorrectEdge({ from: step.edgeFrom!, to: step.edgeTo! });
            if (step.edgeTo) {
              setDijkstraIncorrectNodes(prev => new Set([...prev, step.edgeTo!]));
            }
          }
        } else if (step.type === 'complete') {
          setDijkstraComplete(true);
          setDijkstraCurrentNode(null);
          setDijkstraHighlightedEdge(null);
          if (step.isIncorrect) {
            setDijkstraHasError(true);
          }
        }
      } else {
        setDijkstraComplete(true);
      }

      // Process Bellman-Ford step
      if (currentStepIndex < bellmanFordSteps.length) {
        const step = bellmanFordSteps[currentStepIndex];
        
        if (step.type === 'iteration_start') {
          // Start of new iteration
          if (step.iteration) {
            setBellmanFordIteration(step.iteration);
          }
          // Store previous distances to track stabilization
          setBellmanFordPreviousDistances({ ...bellmanFordDistances });
          setBellmanFordCurrentNode(null);
          setBellmanFordHighlightedEdge(null);
        } else if (step.type === 'check_edge') {
          // Checking an edge (dim highlight)
          setBellmanFordHighlightedEdge({ from: step.edgeFrom!, to: step.edgeTo! });
          // Don't update current node for check_edge
        } else if (step.type === 'relax') {
          // Edge was relaxed (improved distance)
          setBellmanFordCurrentNode(step.edgeTo!);
          setBellmanFordVisited(prev => new Set([...prev, step.edgeTo!]));
          setBellmanFordHighlightedEdge({ from: step.edgeFrom!, to: step.edgeTo! });
          
          if (step.distances) {
            const prevDist = bellmanFordDistances[step.edgeTo!];
            const newDist = step.distances[step.edgeTo!];
            
            // Update distances
            setBellmanFordDistances(step.distances);
            
            // Check if this node's distance has stabilized across iterations
            // A node is stabilized if its distance hasn't changed from previous iteration
            const stabilized = new Set(bellmanFordFinalized);
            Object.keys(step.distances).forEach(nodeId => {
              const currDist = step.distances![nodeId];
              const prevIterDist = bellmanFordPreviousDistances[nodeId];
              
              if (currDist !== Infinity && prevIterDist !== undefined && currDist === prevIterDist) {
                stabilized.add(nodeId);
              }
            });
            setBellmanFordFinalized(stabilized);
          }
          
          if (step.iteration) {
            setBellmanFordIteration(step.iteration);
          }
        } else if (step.type === 'complete') {
          setBellmanFordComplete(true);
          setBellmanFordCurrentNode(null);
          setBellmanFordHighlightedEdge(null);
          // Mark all nodes with finite distances as finalized
          if (step.distances) {
            const finalized = new Set<string>();
            Object.entries(step.distances).forEach(([nodeId, dist]) => {
              if (dist !== Infinity) {
                finalized.add(nodeId);
              }
            });
            setBellmanFordFinalized(finalized);
          }
          // Check for negative cycle
          if (step.hasNegativeCycle) {
            setBellmanFordHasNegativeCycle(true);
          }
        } else if (step.type === 'negative_cycle_check') {
          // Processing negative cycle check
          if (step.hasNegativeCycle) {
            setBellmanFordHasNegativeCycle(true);
          }
        } else if (step.type === 'error') {
          setDijkstraHasError(true);
          setDijkstraIncorrectNodes(step.incorrectNodes!);
          setDijkstraIncorrectEdge(step.incorrectEdge!);
        }
      } else {
        setBellmanFordComplete(true);
      }

      setCurrentStepIndex(prev => prev + 1);
    }, 800); // 800ms delay between steps

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, dijkstraSteps, bellmanFordSteps]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-white mb-2">Shortest Path Algorithm Comparison</h1>
          <p className="text-gray-400">
            Watch Dijkstra&apos;s Algorithm and Bellman–Ford Algorithm solve the same graph
          </p>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleRunAlgorithms}
            disabled={isRunning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Run Both Algorithms
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1 border border-gray-700">
            <button
              onClick={() => {
                setNegativeWeightMode(false);
                setGraph(createGraph());
                handleReset();
              }}
              disabled={isRunning}
              className={`px-6 py-2 rounded-md transition-all ${
                !negativeWeightMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Normal Graph Mode
            </button>
            <button
              onClick={() => {
                setNegativeWeightMode(true);
                setGraph(createNegativeWeightGraph());
                handleReset();
              }}
              disabled={isRunning}
              className={`px-6 py-2 rounded-md transition-all ${
                negativeWeightMode
                  ? 'bg-red-600 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Negative Weights Mode
            </button>
          </div>
        </motion.div>

        {/* Algorithm Panels */}
        <div className="grid grid-cols-2 gap-6 mb-8 mt-12">
          <AlgorithmPanel
            title="Dijkstra's Algorithm"
            subtitle="Greedy Approach"
            graph={graph}
            distances={dijkstraDistances}
            currentNode={dijkstraCurrentNode}
            visitedNodes={dijkstraVisited}
            highlightedEdge={dijkstraHighlightedEdge}
            currentStep={Math.min(currentStepIndex, dijkstraSteps.length)}
            totalSteps={dijkstraSteps.length || 1}
            isComplete={dijkstraComplete}
            algorithmType="dijkstra"
            finalizedNodes={dijkstraFinalized}
            negativeWeightMode={negativeWeightMode}
            hasError={dijkstraHasError}
            incorrectNodes={dijkstraIncorrectNodes}
            incorrectEdge={dijkstraIncorrectEdge}
          />
          <AlgorithmPanel
            title="Bellman–Ford Algorithm"
            subtitle="Dynamic Programming"
            graph={graph}
            distances={bellmanFordDistances}
            currentNode={bellmanFordCurrentNode}
            visitedNodes={bellmanFordVisited}
            highlightedEdge={bellmanFordHighlightedEdge}
            currentStep={Math.min(currentStepIndex, bellmanFordSteps.length)}
            totalSteps={bellmanFordSteps.length || 1}
            iteration={bellmanFordIteration}
            isComplete={bellmanFordComplete}
            algorithmType="bellman-ford"
            finalizedNodes={bellmanFordFinalized}
            negativeWeightMode={negativeWeightMode}
            hasNegativeCycle={bellmanFordHasNegativeCycle}
          />
        </div>

        {/* Comparison Table */}
        <ComparisonTable negativeWeightMode={negativeWeightMode} />
      </div>
    </div>
  );
}