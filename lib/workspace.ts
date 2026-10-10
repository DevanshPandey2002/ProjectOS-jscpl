export type WorkspaceRole = 'Managing Director' | 'Accountant' | 'Admin' | 'Project Manager' | 'Storekeeper' | 'Field Billing Engineer';

export type WorkspaceContext = {
  role: WorkspaceRole;
  project: string;
};

export const WORKSPACE_KEY = 'hetvi-workspace-v1';
export const PROJECTS_KEY = 'hetvi-projects-v1';
export const DEFAULT_PROJECTS = ['Sant Kabir Nagar', 'Siddharth Nagar', 'Mirzapur'];

export const WORKSPACE_ROLES: WorkspaceRole[] = [
  'Managing Director',
  'Accountant',
  'Admin',
  'Project Manager',
  'Storekeeper',
  'Field Billing Engineer',
];

export function readProjects(): string[] {
  if (typeof window === 'undefined') return DEFAULT_PROJECTS;
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROJECTS_KEY) || 'null');
    if (Array.isArray(saved)) {
      const names = saved.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map(x => x.trim());
      return Array.from(new Set([...DEFAULT_PROJECTS, ...names]));
    }
  } catch {
    // Keep the built-in project list available if local data is malformed.
  }
  return DEFAULT_PROJECTS;
}

export function readWorkspace(): WorkspaceContext {
  if (typeof window === 'undefined') return { role: 'Managing Director', project: 'All Projects' };
  try {
    const raw = JSON.parse(window.localStorage.getItem(WORKSPACE_KEY) || 'null');
    if (raw && typeof raw.role === 'string' && typeof raw.project === 'string') {
      return { role: raw.role as WorkspaceRole, project: raw.project };
    }
  } catch {
    // A missing or malformed demo context should not prevent opening the app.
  }
  return { role: 'Managing Director', project: 'All Projects' };
}

export function writeWorkspace(context: WorkspaceContext) {
  if (typeof window !== 'undefined') window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(context));
}

export async function loadWorkspaceBoqData<T extends { lot: string }>(loader: () => Promise<T[]>): Promise<T[]> {
  const rows = await loader();
  const workspace = readWorkspace();
  // The currently bundled Lot 3/Lot 4 BOQ belongs to the Sant Kabir Nagar dataset.
  // Do not present that data as if it belongs to another selected project.
  if (workspace.project === 'All Projects' || workspace.project === 'Sant Kabir Nagar') return rows;
  return [];
}
