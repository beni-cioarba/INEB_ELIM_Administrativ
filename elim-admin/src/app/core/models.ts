/**
 * Re-export of all domain models from the source dataset so consumers
 * can `import { ... } from '../core/models'` without coupling to data files.
 */
export type {
  ScheduleEntry,
  TeamMember,
  Team,
  TeamHistory,
  Youth,
  YouthTeamMembership,
  Parent,
  ParentTeamAssignment,
  ParentYouthLink,
} from './data/schedule-data';

export type YouthRole = 'coordonator' | 'membru';
export type YouthFilter = 'toti' | 'coordonatori' | 'membri';
export type NavTarget = 'team' | 'youth' | 'parent';

export interface ScheduleStats {
  upcoming: number;
  thisMonth: number;
  completed: number;
  teams: number;
}

export interface YouthStats {
  total: number;
  coordinators: number;
  thisWeek: number;
}

export interface MonthGroup<T> {
  key: string;
  label: string;
  entries: T[];
}

export interface CoordinatorRotation {
  name: string;
  team: string;
  count: number;
  color: string;
}
