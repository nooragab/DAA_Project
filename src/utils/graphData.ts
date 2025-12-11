import { Graph } from '../types/graph';

// Create the same graph for both algorithms
export const createGraph = (): Graph => {
  // Offset to center the graph better in the SVG canvas
  const offsetX = 0; // No horizontal offset - already centered
  const offsetY = 60; // Add vertical offset for distance labels
  
  return {
    nodes: [
      { id: 'A', x: 150 + offsetX, y: 100 + offsetY, label: 'A' },
      { id: 'B', x: 300 + offsetX, y: 50 + offsetY, label: 'B' },
      { id: 'C', x: 450 + offsetX, y: 100 + offsetY, label: 'C' },
      { id: 'D', x: 150 + offsetX, y: 250 + offsetY, label: 'D' },
      { id: 'E', x: 300 + offsetX, y: 200 + offsetY, label: 'E' },
      { id: 'F', x: 450 + offsetX, y: 250 + offsetY, label: 'F' },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'D', weight: 2 },
      { from: 'B', to: 'C', weight: 3 },
      { from: 'B', to: 'E', weight: 1 },
      { from: 'D', to: 'E', weight: 3 },
      { from: 'E', to: 'C', weight: 2 },
      { from: 'E', to: 'F', weight: 5 },
      { from: 'C', to: 'F', weight: 1 },
    ],
  };
};

// Create graph with negative weights that breaks Dijkstra
export const createNegativeWeightGraph = (): Graph => {
  const offsetX = 0;
  const offsetY = 60;
  
  return {
    nodes: [
      { id: 'A', x: 100 + offsetX, y: 175 + offsetY, label: 'A' },
      { id: 'B', x: 220 + offsetX, y: 100 + offsetY, label: 'B' },
      { id: 'C', x: 220 + offsetX, y: 250 + offsetY, label: 'C' },
      { id: 'D', x: 340 + offsetX, y: 100 + offsetY, label: 'D' },
      { id: 'E', x: 340 + offsetX, y: 250 + offsetY, label: 'E' },
      { id: 'F', x: 480 + offsetX, y: 175 + offsetY, label: 'F' },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 2 },
      { from: 'A', to: 'C', weight: 4 },
      { from: 'B', to: 'D', weight: 3 },
      { from: 'C', to: 'E', weight: 1 },
      { from: 'D', to: 'E', weight: -3 }, // First negative edge
      { from: 'E', to: 'F', weight: 2 },
      { from: 'B', to: 'E', weight: -2 }, // Second negative edge
      { from: 'C', to: 'F', weight: 8 },
    ],
  };
};