import { createContext, use } from "react";

export const WorkspaceContext = createContext();

export function useWorkspace() {
  return use(WorkspaceContext);
}
