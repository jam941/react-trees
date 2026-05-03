import type { PositionedNode, ProcessGraphProps } from '../types';

interface NodeLayerProps<TNode> {
  nodes: PositionedNode<TNode>[];
  renderNode: ProcessGraphProps<TNode>['renderNode'];
}

export function NodeLayer<TNode>({ nodes, renderNode }: NodeLayerProps<TNode>) {
  return (
    <>
      {nodes.map((node) => (
        <div
          key={node.id}
          data-rpg-node={node.id}
          role="group"
          aria-label={`Node ${node.id}`}
          style={{
            position: 'absolute',
            left: node.x,
            top: node.y,
            width: node.width,
            height: node.height,
            boxSizing: 'border-box',
          }}
        >
          {renderNode(node)}
        </div>
      ))}
    </>
  );
}
