export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface NodeState {
  distance: number;
  visited: boolean;
  current: boolean;
  parent: string | null;
}

export interface EdgeState {
  highlighting: boolean;
}

export interface AlgorithmStep {
  type: 'visit' | 'relax' | 'complete' | 'check_edge' | 'iteration_start' | 'negative_cycle_check';
  nodeId?: string;
  edgeFrom?: string;
  edgeTo?: string;
  distances?: { [key: string]: number };
  iteration?: number;
  improved?: boolean;
  isIncorrect?: boolean; // For Dijkstra with negative weights
  correctDistances?: { [key: string]: number }; // The correct distances for comparison
  hasNegativeCycle?: boolean; // For Bellman-Ford negative cycle detection
}