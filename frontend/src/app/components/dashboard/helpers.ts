// src/app/components/dashboard/dashboard.component.ts
// NOTE: The dashboard component uses helper methods instead of pipes
// for statusLabel and priorityColor to keep it self-contained.

// Add these methods to DashboardComponent if needed:

export function priorityColor(p: string): string {
  return ({ HIGH: '#ff5a6e', MEDIUM: '#ffaa3b', LOW: '#5a9eff' } as any)[p] ?? '#6b7080';
}

export function statusLabel(s: string): string {
  return ({ TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' } as any)[s] ?? s;
}

export function statusClass(s: string): string {
  return ({ TODO: 'todo', IN_PROGRESS: 'in-progress', DONE: 'done' } as any)[s] ?? '';
}
