export type Priority = 0|1|2;
export interface Todo { id: string; title: string; notes?: string; done: boolean; tags: string[]; createdAt: string; dueAt?: string; priority: Priority; order: string; }
export type StatusFilter = "all"|"active"|"completed";
export type DueFilter = "all"|"today"|"overdue"|"none";
export type SortBy = "custom"|"due"|"created"|"alpha";
export interface Filters { status: StatusFilter; due: DueFilter; tags: string[]; sortBy: SortBy; }
export interface AppState { version: 1; todos: Todo[]; tags: string[]; filters: Filters; search: string; trash?: Todo[]; }
