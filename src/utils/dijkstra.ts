import { Graph, AlgorithmStep } from '../types/graph';

// Helper function to run Bellman-Ford to get correct distances
const getCorrectDistances = (graph: Graph, startNode: string): { [key: string]: number } => {
  const distances: { [key: string]: number } = {};
  
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
  });

  // Relax edges n-1 times
  for (let i = 0; i < graph.nodes.length - 1; i++) {
    for (const edge of graph.edges) {
      if (distances[edge.from] !== Infinity) {
        const newDistance = distances[edge.from] + edge.weight;
        if (newDistance < distances[edge.to]) {
          distances[edge.to] = newDistance;
        }
      }
    }
  }

  return distances;
};

export const generateDijkstraSteps = (
  graph: Graph, 
  startNode: string, 
  negativeWeightMode: boolean = false
): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const distances: { [key: string]: number } = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>();

  // Get correct distances if in negative weight mode
  const correctDistances = negativeWeightMode ? getCorrectDistances(graph, startNode) : null;

  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
    unvisited.add(node.id);
  });

  let stoppedDueToNegativeEdge = false;

  while (unvisited.size > 0 && !stoppedDueToNegativeEdge) {
    // Find node with minimum distance
    let currentNode: string | null = null;
    let minDistance = Infinity;
    
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNode = nodeId;
      }
    });

    if (currentNode === null || distances[currentNode] === Infinity) break;

    // Visit current node
    const isNodeIncorrect = negativeWeightMode && correctDistances && 
                           distances[currentNode] !== correctDistances[currentNode];
    
    steps.push({
      type: 'visit',
      nodeId: currentNode,
      distances: { ...distances },
      isIncorrect: isNodeIncorrect,
      correctDistances: negativeWeightMode ? correctDistances : undefined,
    });

    unvisited.delete(currentNode);
    visited.add(currentNode);

    // Relax edges
    const edgesFromCurrent = graph.edges.filter(edge => edge.from === currentNode);
    
    for (const edge of edgesFromCurrent) {
      // في Negative Weight Mode، لو لقينا edge سالب نوقف Dijkstra
      if (negativeWeightMode && edge.weight < 0) {
        // إضافة خطوة توضح أن Dijkstra لقى negative edge ووقف
        steps.push({
          type: 'relax',
          edgeFrom: edge.from,
          edgeTo: edge.to,
          distances: { ...distances },
          isIncorrect: true,
          correctDistances: correctDistances,
        });
        stoppedDueToNegativeEdge = true;
        break;
      }
      
      const newDistance = distances[edge.from] + edge.weight;
      
      if (newDistance < distances[edge.to]) {
        const isRelaxIncorrect = negativeWeightMode && correctDistances && 
                                newDistance !== correctDistances[edge.to];
        
        steps.push({
          type: 'relax',
          edgeFrom: edge.from,
          edgeTo: edge.to,
          distances: { ...distances, [edge.to]: newDistance },
          isIncorrect: isRelaxIncorrect,
          correctDistances: negativeWeightMode ? correctDistances : undefined,
        });
        distances[edge.to] = newDistance;
      }
    }
  }

  // Check if final result is incorrect or if stopped
  let hasIncorrectDistances = stoppedDueToNegativeEdge;
  if (negativeWeightMode && correctDistances && !stoppedDueToNegativeEdge) {
    for (const nodeId in distances) {
      if (distances[nodeId] !== correctDistances[nodeId]) {
        hasIncorrectDistances = true;
        break;
      }
    }
  }

  steps.push({
    type: 'complete',
    distances: { ...distances },
    isIncorrect: hasIncorrectDistances || stoppedDueToNegativeEdge,
    correctDistances: negativeWeightMode ? correctDistances : undefined,
  });

  return steps;
};