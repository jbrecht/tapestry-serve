# Tapestry Serve

This is the backend service for **Tapestry**, an application that weaves conversational input into a dynamic Knowledge Graph. It leverages LangChain, LangGraph, and OpenAI to extract structured entities (Person, Place, Thing, Event) and relationships from natural language.

## 🚀 Features

- **Graph Extraction**: Transforms user messages into a structured graph of Nodes and Edges using GPT-4o.
- **Context Awareness**: Maintains conversation history and existing graph state to update and expand the knowledge base incrementally.
- **Entity Resolution**: Merges new information into existing nodes rather than creating duplicates (e.g., updating attributes).
- **API Endpoint**: Exposes a RESTful API (`POST /weave`) to interact with the LangGraph workflow.

## 🛠️ Tech Stack

- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **AI/LLM orchestration**: LangChain, LangGraph, OpenAI (`gpt-4o`)
- **Validation**: Zod
- ** Utilities**: `dotenv`, `cors`, `uuid`

## 📂 Project Structure

- `src/index.ts`: Application entry point. Configures the Express server and defines the `/weave` endpoint which executes the graph.
- `src/schema.ts`: Defines TypeScript interfaces (`TapestryNode`, `TapestryEdge`) and Zod schemas for structured output.
- `src/state.ts`: Defines the `TapestryState` using LangGraph's `Annotation.Root`. This state holds messages, nodes, edges, and the next prompt.
- `src/extractor.ts`: Contains the core logic (`extractionNode`) that invokes the LLM to parse input and update the graph state.

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A valid OpenAI API Key

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=sk-your-api-key-here
    PORT=3000
    ```

### Running the Server

- **Development Mode** (with hot-reload):
  ```bash
  npm run dev
  ```
- **Production Build & Start**:
  ```bash
  npm run build
  npm start
  ```

## 🔌 API Reference

### `POST /weave`

Processes a user message and returns the updated graph state.

**Request Body:**

```json
{
  "message": "User's input message",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ],
  "nodes": [ ...current nodes... ],
  "edges": [ ...current edges... ]
}
```

**Response:**

```json
{
  "nodes": [ ...updated nodes... ],
  "edges": [ ...updated edges... ],
  "reply": "AI's suggested follow-up response"
}
```
