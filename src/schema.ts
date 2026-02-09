import { z } from "zod";

export const NodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string().optional(),
  properties: z.record(z.string(), z.any()).optional(),
});

export const EdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  relation: z.string().optional(),
});

export const GraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

export type Node = z.infer<typeof NodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Graph = z.infer<typeof GraphSchema>;
