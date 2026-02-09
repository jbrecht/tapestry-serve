import { StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

// Define the state for our graph
interface AgentState {
  messages: (HumanMessage | SystemMessage)[];
  extractedData?: any;
}

// Define the nodes
const extractor = async (state: AgentState) => {
  const { messages } = state;
  const response = await model.invoke([
    new SystemMessage("You are an expert at extracting structured data from text."),
    ...messages,
  ]);
  return { messages: [...messages, response] };
};

const interrogator = async (state: AgentState) => {
    // Placeholder for interrogation logic
    return state;
}

// Create the graph
const workflow = new StateGraph<AgentState>({
    channels: {
        messages: {
            value: (x: (HumanMessage | SystemMessage)[], y: (HumanMessage | SystemMessage)[]) => x.concat(y),
            default: () => [],
        },
        extractedData: {
            value: (x: any, y: any) => y ? y : x,
            default: () => ({}),
        }
    }
})
  .addNode("extractor", extractor)
  .addNode("interrogator", interrogator)
  .addEdge("__start__", "extractor")
  .addEdge("extractor", "interrogator")
  .addEdge("interrogator", "__end__");

export const app = workflow.compile();
