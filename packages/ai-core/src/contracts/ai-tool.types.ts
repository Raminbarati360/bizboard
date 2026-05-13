export interface AiToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}
