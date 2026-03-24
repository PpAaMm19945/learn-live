import React from 'react';
import { ShowComponentParams } from '@/lib/player/types';
import { AnimatePresence, motion } from 'framer-motion';

// Visual components
import { ScriptureCard } from '@/components/visuals/ScriptureCard';
import { PortraitCard } from '@/components/visuals/PortraitCard';
import { DefinitionCard } from '@/components/visuals/DefinitionCard';
import { GenealogyTree } from '@/components/visuals/GenealogyTree';
import { DualTimeline } from '@/components/visuals/DualTimeline';
import { ComparisonView } from '@/components/visuals/ComparisonView';
import { MapOverlay } from '@/components/visuals/MapOverlay';
import { SceneImage } from '@/components/visuals/SceneImage';
import { RouteAnimation } from '@/components/visuals/RouteAnimation';

interface ComponentRendererProps {
  visibleComponents: Map<string, ShowComponentParams>;
  band: number;
}

function renderComponent(componentId: string, params: ShowComponentParams, band: number) {
  const { componentType, data } = params;

  switch (componentType) {
    case 'scripture_card':
      return (
        <ScriptureCard
          key={componentId}
          reference={data.reference}
          text={data.text}
          connection={data.connection}
          band={data.band ?? band}
        />
      );

    case 'portrait_card':
      return (
        <PortraitCard
          key={componentId}
          name={data.name}
          title={data.title}
          dates={data.dates}
          imageUrl={data.imageUrl}
          quote={data.quote}
        />
      );

    case 'definition_card':
      return (
        <DefinitionCard
          key={componentId}
          term={data.term}
          definition={data.definition}
          scriptureRef={data.scriptureRef}
          originalLanguage={data.originalLanguage}
          band={data.band ?? band}
        />
      );

    case 'genealogy_tree':
      return (
        <GenealogyTree
          key={componentId}
          treeData={data.treeData}
          revealUpTo={data.revealUpTo}
          band={data.band ?? band}
        />
      );

    case 'dual_timeline':
      return (
        <DualTimeline
          key={componentId}
          events={data.events}
          mode={data.mode}
          activeEventId={data.activeEventId}
          band={data.band ?? band}
        />
      );

    case 'comparison_view':
      return (
        <ComparisonView
          key={componentId}
          biblicalData={data.biblicalData}
          conventionalData={data.conventionalData}
          resolution={data.resolution}
          activeHighlight={data.activeHighlight}
          band={data.band ?? band}
        />
      );

    case 'map':
      return (
        <MapOverlay
          key={componentId}
          pngUrl={data.pngUrl}
          svgUrl={data.svgUrl}
          transform={data.transform}
          highlights={data.highlights}
          activeRegion={data.activeRegion}
          band={data.band ?? band}
        />
      );

    case 'scene_image':
      return (
        <SceneImage
          key={componentId}
          imageUrl={data.imageUrl}
          altText={data.altText}
          caption={data.caption}
        />
      );

    default:
      return null;
  }
}

export function ComponentRenderer({ visibleComponents, band }: ComponentRendererProps) {
  // Filter out __tool_call__ pseudo-components (handled by ScriptPlayer bridge)
  const entries = Array.from(visibleComponents.entries())
    .filter(([, params]) => (params.componentType as string) !== '__tool_call__');

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div className="flex flex-col items-center gap-4 max-h-[80vh] overflow-y-auto p-4 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {entries.map(([id, params]) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-2xl"
            >
              {renderComponent(id, params, band)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
