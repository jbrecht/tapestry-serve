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
  // We explicitly define the keys we care about for our "Perspectives"
  // and add a generic "metadata" string for anything else.
  attributes: z.object({
    coordinates: z.object({
      x: z.number(),
      y: z.number()
    }).optional().describe("Coordinates if the entity is a location"),
    timestamp: z.string().optional().describe("Date or time if the entity is an event"),
    locationType: z.string().optional().describe("e.g., 'city', 'mountain'"),
    extraInfo: z.string().optional().describe("Any other notable details as a string")
  }).optional()
}).strict(); // Adding .strict() helps ensure the schema is clean for OpenAI

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