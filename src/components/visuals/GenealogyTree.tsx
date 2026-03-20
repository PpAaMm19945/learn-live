import React from 'react';
import { motion } from 'framer-motion';

export interface TreeNode {
  id: string;
  name: string;
  dates?: string;
  descriptor?: string;
  children?: TreeNode[];
}

export interface GenealogyTreeProps {
  treeData: {
    nodes: TreeNode[];
  };
  revealUpTo?: string;
  band: number;
}

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  band: number;
  depth: number;
}> = ({ node, band, depth }) => {
  if (band === 0) return null;

  const showDetails = band >= 3;

  return (
    <li className={`ml-${depth > 0 ? '6' : '0'} border-l-2 border-border pl-4 py-2 relative`}>
      <div className="absolute w-4 h-0.5 bg-border left-0 top-6" />
      <div className="bg-card text-card-foreground border border-border rounded-md p-3 shadow-sm inline-block min-w-[150px]">
        <h4 className="font-bold text-lg">{node.name}</h4>
        {showDetails && node.dates && (
          <p className="text-sm text-muted-foreground">{node.dates}</p>
        )}
        {showDetails && node.descriptor && (
          <p className="text-sm italic mt-1">{node.descriptor}</p>
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="mt-2">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              band={band}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({
  treeData,
  revealUpTo,
  band,
}) => {
  if (band === 0 || !treeData || !treeData.nodes) return null;

  return (
    <motion.div
      className="p-6 overflow-auto max-h-full max-w-full bg-black/60 backdrop-blur-md rounded-xl border border-border/50 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <ul className="list-none p-0 m-0">
        {treeData.nodes.map((node) => (
          <TreeNodeComponent key={node.id} node={node} band={band} depth={0} />
        ))}
      </ul>
    </motion.div>
  );
};
