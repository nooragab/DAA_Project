import { motion } from 'motion/react';
import { Graph } from '../types/graph';

interface GraphVisualizationProps {
  graph: Graph;
  distances: { [key: string]: number };
  currentNode: string | null;
  visitedNodes: Set<string>;
  highlightedEdge: { from: string; to: string } | null;
  algorithmType: 'dijkstra' | 'bellman-ford';
  finalizedNodes?: Set<string>;
  hasError?: boolean;
  incorrectNodes?: Set<string>;
  incorrectEdge?: { from: string; to: string } | null;
  hasNegativeCycle?: boolean;
}

export function GraphVisualization({
  graph,
  distances,
  currentNode,
  visitedNodes,
  highlightedEdge,
  algorithmType,
  finalizedNodes = new Set(),
  hasError = false,
  incorrectNodes = new Set(),
  incorrectEdge = null,
  hasNegativeCycle = false,
}: GraphVisualizationProps) {
  const getNodeColor = (nodeId: string) => {
    // Show incorrect nodes in red for Dijkstra with negative weights
    if (algorithmType === 'dijkstra' && incorrectNodes.has(nodeId)) {
      return '#ef4444'; // red
    }
    
    if (algorithmType === 'dijkstra') {
      // Dijkstra: yellow for current, green for finalized
      if (nodeId === currentNode) return '#eab308'; // yellow
      if (finalizedNodes.has(nodeId)) return '#10b981'; // green
      if (visitedNodes.has(nodeId)) return '#6b7280'; // gray
      return '#4b5563'; // dark gray
    } else {
      // Bellman-Ford: purple for current, green for stabilized
      if (nodeId === currentNode) return '#a855f7'; // purple
      if (finalizedNodes.has(nodeId)) return '#10b981'; // green
      if (visitedNodes.has(nodeId)) return '#6b7280'; // gray
      return '#4b5563'; // dark gray
    }
  };

  const getEdgeColor = () => {
    if (algorithmType === 'dijkstra') {
      return '#fb923c'; // orange
    } else {
      return '#a855f7'; // purple
    }
  };

  const isEdgeHighlighted = (from: string, to: string) => {
    return highlightedEdge?.from === from && highlightedEdge?.to === to;
  };

  const isEdgeIncorrect = (from: string, to: string) => {
    return algorithmType === 'dijkstra' && incorrectEdge?.from === from && incorrectEdge?.to === to;
  };

  return (
    <svg
      width="600"
      height="400"
      className="mx-auto"
      style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
    >
      {/* Render edges */}
      {graph.edges.map((edge, idx) => {
        const fromNode = graph.nodes.find(n => n.id === edge.from);
        const toNode = graph.nodes.find(n => n.id === edge.to);
        
        if (!fromNode || !toNode) return null;

        const highlighted = isEdgeHighlighted(edge.from, edge.to);
        const incorrect = isEdgeIncorrect(edge.from, edge.to);
        const highlightColor = getEdgeColor();
        const isNegativeWeight = edge.weight < 0;
        
        // Calculate midpoint for weight label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;

        return (
          <g key={`edge-${idx}`}>
            <motion.line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={
                isEdgeIncorrect(edge.from, edge.to) 
                  ? '#ef4444' 
                  : highlighted 
                    ? highlightColor 
                    : (isNegativeWeight ? '#f97316' : '#374151')
              }
              strokeWidth={highlighted || isEdgeIncorrect(edge.from, edge.to) ? 4 : 2}
              animate={{
                stroke: isEdgeIncorrect(edge.from, edge.to) 
                  ? '#ef4444' 
                  : highlighted 
                    ? highlightColor 
                    : (isNegativeWeight ? '#f97316' : '#374151'),
                strokeWidth: highlighted || isEdgeIncorrect(edge.from, edge.to) ? 4 : 2,
              }}
              transition={{ duration: 0.4 }}
              style={{ opacity: highlighted || isEdgeIncorrect(edge.from, edge.to) ? 1 : 0.6 }}
            />
            {/* Arrow head */}
            <motion.polygon
              points={getArrowPoints(fromNode.x, fromNode.y, toNode.x, toNode.y)}
              fill={
                isEdgeIncorrect(edge.from, edge.to) 
                  ? '#ef4444' 
                  : highlighted 
                    ? highlightColor 
                    : (isNegativeWeight ? '#f97316' : '#374151')
              }
              animate={{
                fill: isEdgeIncorrect(edge.from, edge.to) 
                  ? '#ef4444' 
                  : highlighted 
                    ? highlightColor 
                    : (isNegativeWeight ? '#f97316' : '#374151'),
              }}
              transition={{ duration: 0.4 }}
              style={{ opacity: highlighted || isEdgeIncorrect(edge.from, edge.to) ? 1 : 0.6 }}
            />
            {/* Weight label */}
            <motion.circle
              cx={midX}
              cy={midY}
              r="16"
              fill="#1f2937"
              stroke={
                isEdgeIncorrect(edge.from, edge.to) 
                  ? '#ef4444' 
                  : highlighted 
                    ? highlightColor 
                    : (isNegativeWeight ? '#f97316' : '#4b5563')
              }
              strokeWidth={highlighted || isEdgeIncorrect(edge.from, edge.to) ? 3 : 2}
              animate={{
                stroke: isEdgeIncorrect(edge.from, edge.to) 
                  ? '#ef4444' 
                  : highlighted 
                    ? highlightColor 
                    : (isNegativeWeight ? '#f97316' : '#4b5563'),
                strokeWidth: highlighted || isEdgeIncorrect(edge.from, edge.to) ? 3 : 2,
                scale: highlighted || isEdgeIncorrect(edge.from, edge.to) ? 1.1 : 1,
              }}
              transition={{ duration: 0.4 }}
              style={{ transformOrigin: `${midX}px ${midY}px` }}
            />
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              dy="0.3em"
              fill={isNegativeWeight ? '#fed7aa' : '#fff'}
              fontSize="13"
            >
              {edge.weight}
            </text>
          </g>
        );
      })}

      {/* Render nodes */}
      {graph.nodes.map(node => {
        const distance = distances[node.id];
        const distanceText = distance === undefined || distance === Infinity ? '∞' : distance.toString();
        const isCurrentNode = node.id === currentNode;
        const isFinalized = finalizedNodes.has(node.id);
        
        return (
          <g key={`node-${node.id}`}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="28"
              fill={getNodeColor(node.id)}
              stroke={isCurrentNode ? '#fff' : 'transparent'}
              strokeWidth={3}
              animate={{
                fill: getNodeColor(node.id),
                scale: isCurrentNode ? 1.15 : 1,
                strokeWidth: isCurrentNode ? 3 : 0,
              }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
            {/* Glow effect for current node */}
            {isCurrentNode && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="35"
                fill="none"
                stroke={getNodeColor(node.id)}
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.35em"
              fill="#fff"
              fontSize="16"
            >
              {node.label}
            </text>
            {/* Distance label */}
            <motion.g
              animate={{
                scale: visitedNodes.has(node.id) || isCurrentNode ? 1 : 0.85,
                opacity: visitedNodes.has(node.id) || isCurrentNode ? 1 : 0.5,
              }}
              transition={{ duration: 0.4 }}
              style={{ transformOrigin: `${node.x}px ${node.y - 45}px` }}
            >
              <rect
                x={node.x - 20}
                y={node.y - 58}
                width="40"
                height="26"
                rx="6"
                fill={isFinalized ? '#065f46' : '#1e3a8a'}
                stroke={isFinalized ? '#10b981' : '#3b82f6'}
                strokeWidth="2"
              />
              <motion.text
                x={node.x}
                y={node.y - 45}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                animate={{
                  scale: distance !== Infinity && distance !== undefined ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: `${node.x}px ${node.y - 45}px` }}
              >
                {distanceText}
              </motion.text>
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

// Helper function to calculate arrow points
function getArrowPoints(x1: number, y1: number, x2: number, y2: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLength = 10;
  const arrowWidth = 6;
  
  // Position arrow near the target node (accounting for node radius)
  const nodeRadius = 25;
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const ratio = (distance - nodeRadius) / distance;
  
  const arrowTipX = x1 + (x2 - x1) * ratio;
  const arrowTipY = y1 + (y2 - y1) * ratio;
  
  const point1X = arrowTipX - arrowLength * Math.cos(angle - Math.PI / 6);
  const point1Y = arrowTipY - arrowLength * Math.sin(angle - Math.PI / 6);
  
  const point2X = arrowTipX - arrowLength * Math.cos(angle + Math.PI / 6);
  const point2Y = arrowTipY - arrowLength * Math.sin(angle + Math.PI / 6);
  
  return `${arrowTipX},${arrowTipY} ${point1X},${point1Y} ${point2X},${point2Y}`;
}