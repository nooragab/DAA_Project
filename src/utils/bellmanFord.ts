import { Graph, AlgorithmStep } from '../types/graph';

export const generateBellmanFordSteps = (graph: Graph, startNode: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const distances: { [key: string]: number } = {};

  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
  });

  // Relax edges n-1 times
  for (let i = 0; i < graph.nodes.length - 1; i++) {
    // Mark the start of a new iteration
    steps.push({
      type: 'iteration_start',
      iteration: i + 1,
      distances: { ...distances },
    });

    let updatedInIteration = false;
    const previousDistances = { ...distances };

    // Check each edge
    for (const edge of graph.edges) {
      // Check edge step (even if not relaxed)
      steps.push({
        type: 'check_edge',
        edgeFrom: edge.from,
        edgeTo: edge.to,
        distances: { ...distances },
        iteration: i + 1,
        improved: false,
      });

      if (distances[edge.from] !== Infinity) {
        const newDistance = distances[edge.from] + edge.weight;
        
        if (newDistance < distances[edge.to]) {
          steps.push({
            type: 'relax',
            edgeFrom: edge.from,
            edgeTo: edge.to,
            distances: { ...distances, [edge.to]: newDistance },
            iteration: i + 1,
            improved: true,
          });
          distances[edge.to] = newDistance;
          updatedInIteration = true;
        }
      }
    }

    // If no updates in this iteration, we can still continue to show all iterations
    // (for educational purposes, we'll show all n-1 iterations)
  }

  // Check for negative cycles (n-th iteration)
  let hasNegativeCycle = false;
  steps.push({
    type: 'negative_cycle_check',
    distances: { ...distances },
    hasNegativeCycle: false,
  });

  for (const edge of graph.edges) {
    if (distances[edge.from] !== Infinity) {
      const newDistance = distances[edge.from] + edge.weight;
      if (newDistance < distances[edge.to]) {
        hasNegativeCycle = true;
        break;
      }
    }
  }

  steps.push({
    type: 'complete',
    distances: { ...distances },
    hasNegativeCycle: hasNegativeCycle,
  });

  return steps;
};