import { z } from "zod";

/**
 * CORE TYPES
 * These match the "Tapestry" logic for People, Places, Things, and Events.
 */

export interface TapestryNode {
  id: string;
  label: string;
  type: 'Person' | 'Place' | 'Thing' | 'Event';
  description?: string;
  attributes: {
    // Reserved for "Map" Perspective
    coordinates?: { x: number; y: number };
    locationType?: string;
    
    // Reserved for "Timeline" Perspective
    timestamp?: string; // ISO or relative string
    
    // Catch-all for everything else
    [key: string]: any;
  };
}

export interface TapestryEdge {
  id: string;
  sourceId: string;
  targetId: string;
  predicate: string; // e.g., "LIVES_IN", "FRIEND_OF", "HAPPENED_AT"
  attributes?: Record<string, any>;
}

/**
 * EXTRACTION SCHEMAS
 * Used by OpenAI's Structured Output to force the AI to return the correct JSON.
 */

export const NodeExtractionSchema = z.object({
  label: z.string().describe("The name of the entity"),
  type: z.enum(['Person', 'Place', 'Thing', 'Event']),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional().describe("Include coordinates or timestamps if mentioned"),
});

export const EdgeExtractionSchema = z.object({
  sourceLabel: z.string().describe("The name of the starting node"),
  targetLabel: z.string().describe("The name of the ending node"),
  predicate: z.string().describe("The relationship verb, e.g., 'SPOUSE_OF'"),
});

export const TapestryExtractionSchema = z.object({
  extractedNodes: z.array(NodeExtractionSchema),
  extractedEdges: z.array(EdgeExtractionSchema),
  suggestedFollowUp: z.string().describe("A question to ask the user to grow the graph"),
});