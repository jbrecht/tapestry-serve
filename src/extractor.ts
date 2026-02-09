import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { TapestryState} from "./state.js";
import { TapestryExtractionSchema, TapestryNode, TapestryEdge } from "./schema.js";
import { v4 as uuidv4 } from "uuid";

export async function extractionNode(state: typeof TapestryState.State) {
  const model = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
  const structuredModel = model.withStructuredOutput(TapestryExtractionSchema);
  
  const systemPrompt = `You are the Loom. Weave the input into the current Knowledge Graph.
    Current Nodes: ${JSON.stringify(state.nodes)}
    
    Rules:
    1. Entity Resolution: If an entity exists (check 'label'), do NOT create a new node.
    2. Attributes: Add new info to 'attributes' (like 'timestamp' for Events).
    3. Links: Create edges between nodes using labels.`;

  const result = await structuredModel.invoke([
    new SystemMessage(systemPrompt),
    ...state.messages,
  ]);

  const updatedNodes = [...state.nodes];
  const updatedEdges = [...state.edges];

  // 1. Process New Nodes (or update existing)
  result.extractedNodes.forEach(newNode => {
    const existing = updatedNodes.find(n => n.label.toLowerCase() === newNode.label.toLowerCase());
    if (existing) {
      existing.attributes = { ...existing.attributes, ...newNode.attributes };
      if (newNode.description) existing.description = newNode.description;
    } else {
      updatedNodes.push({
        id: uuidv4(),
        ...newNode,
        attributes: newNode.attributes || {}
      } as TapestryNode);
    }
  });

  // 2. Process New Edges
  result.extractedEdges.forEach(newEdge => {
    const source = updatedNodes.find(n => n.label.toLowerCase() === newEdge.sourceLabel.toLowerCase());
    const target = updatedNodes.find(n => n.label.toLowerCase() === newEdge.targetLabel.toLowerCase());
    
    if (source && target) {
      updatedEdges.push({
        id: uuidv4(),
        sourceId: source.id,
        targetId: target.id,
        predicate: newEdge.predicate
      } as TapestryEdge);
    }
  });

  return { 
    nodes: updatedNodes, 
    edges: updatedEdges, 
    nextPrompt: result.suggestedFollowUp 
  };
}