import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  SCHEDULE_DATA,
  TEAMS_DATA,
  TEAMS_HISTORY,
  RULES,
  PARENTS,
  PARENT_TEAM_ASSIGNMENTS,
  PARENT_YOUTH_LINKS,
  YOUTHS,
  YOUTH_TEAM_MEMBERSHIPS,
  ScheduleEntry,
  Parent,
  Youth,
} from './data/schedule-data';

/* ──────────────────────── Constantes (frozen, reused) ──────────────────────── */
const DAYS_LONG = Object.freeze(['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']);
const DAYS_SHORT = Object.freeze(['DUM', 'LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SÂM']);
const MONTHS_LONG = Object.freeze(['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']);
const MONTHS_LONG_LOWER = Object.freeze(['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie']);
const MONTHS_SHORT = Object.freeze(['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
const MONTHS_SHORT_UPPER = Object.freeze(['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']);

const TEAM_COLORS: Readonly<Record<string, string>> = Object.freeze({
  'Echipa 1': '#1565c0',
  'Echipa 2': '#6a1b9a',
  'Echipa 3': '#2e7d32',
  'Echipa 4': '#e65100',
  'Echipa 5': '#c62828',
  'Echipa 6': '#00838f',
  'Echipa 7': '#ad1457',
});

const TEAM_ICONS: Readonly<Record<string, string>> = Object.freeze({
  'Echipa 1': 'looks_one',
  'Echipa 2': 'looks_two',
  'Echipa 3': 'looks_3',
  'Echipa 4': 'looks_4',
  'Echipa 5': 'looks_5',
  'Echipa 6': 'looks_6',
  'Echipa 7': 'filter_7',
});

const RULE_ICONS = Object.freeze(['person', 'checklist', 'schedule', 'cleaning_services']);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
    MatRippleModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /* ─────── Raw data references ─────── */
  scheduleData = SCHEDULE_DATA;
  teamsData = TEAMS_DATA;
  teamsHistory = TEAMS_HISTORY;
  rules = RULES;
  parents = PARENTS;
  parentAssignments = PARENT_TEAM_ASSIGNMENTS;
  parentYouthLinks = PARENT_YOUTH_LINKS;
  youths = YOUTHS;
  youthMemberships = YOUTH_TEAM_MEMBERSHIPS;

  /* ─────── Derived (set in ngOnInit) ─────── */
  youthsSorted: Youth[] = [];
  upcomingSchedule: ScheduleEntry[] = [];
  pastSchedule: ScheduleEntry[] = [];
  nextEvent: ScheduleEntry | null = null;

  // Pre-computed views (avoid recomputing on every change-detection cycle)
  nextThree: ScheduleEntry[] = [];
  upcomingByMonth: Array<{ key: string; label: string; entries: ScheduleEntry[] }> = [];
  pastByMonth: Array<{ key: string; label: string; entries: ScheduleEntry[] }> = [];
  totalMealsServed = 0;
  coordinatorRotations: Array<{ name: string; team: string; count: number; color: string }> = [];
  scheduleStats: { upcoming: number; thisMonth: number; completed: number; teams: number } =
    { upcoming: 0, thisMonth: 0, completed: 0, teams: 0 };
  youthStats: { total: number; coordinators: number; thisWeek: number } =
    { total: 0, coordinators: 0, thisWeek: 0 };
  todayLabel = '';
  nextParentEvent: { entry: ScheduleEntry; people: Parent[] } | null = null;

  // Filtered youths (recomputed only on filter/search change)
  filteredYouths: Youth[] = [];

  /* ─────── O(1) lookup maps (built once) ─────── */
  private parentsByTeam = new Map<string, Parent[]>();
  private teamsByParent = new Map<string, string[]>();
  private youthsForParentMap = new Map<string, Array<{ youth: Youth; relationship: string }>>();
  private parentsForYouthMap = new Map<string, Array<{ parent: Parent; relationship: string }>>();
  private youthsByTeam = new Map<string, Youth[]>();
  private coordinatorByTeam = new Map<string, Youth | undefined>();
  private activeTeamsByYouth = new Map<string, Array<{ teamName: string; role: 'coordonator' | 'membru' }>>();
  private historicalTeamsByYouth = new Map<string, Array<{ teamName: string; role: 'coordonator' | 'membru'; endDate?: Date }>>();
  private nextEventByTeam = new Map<string, ScheduleEntry>();
  private nextEventByParent = new Map<string, ScheduleEntry>();
  private nextEventByYouth = new Map<string, ScheduleEntry>();
  private upcomingEventsByYouth = new Map<string, ScheduleEntry[]>();
  private youthByName = new Map<string, Youth>();
  private youthById = new Map<string, Youth>();
  private parentById = new Map<string, Parent>();

  /* ─────── UI state ─────── */
  activeTab = 0;
  showPastSchedule = false;
  showTeamHistory = false;
  expandedTeam: string | null = null;
  expandedParentId: string | null = null;
  expandedYouthId: string | null = null;
  youthFilter: 'toti' | 'coordonatori' | 'membri' = 'toti';
  private _youthSearch = '';
  get youthSearch(): string { return this._youthSearch; }
  set youthSearch(v: string) {
    if (v === this._youthSearch) return;
    this._youthSearch = v;
    this.recomputeFilteredYouths();
  }

  today = new Date();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);

    // Sort schedule once (static input → safe to cache)
    const sorted = [...this.scheduleData].sort((a, b) => a.date.getTime() - b.date.getTime());
    const todayMs = this.today.getTime();
    this.pastSchedule = sorted.filter(e => e.date.getTime() < todayMs);
    this.upcomingSchedule = sorted.filter(e => e.date.getTime() >= todayMs);
    this.nextEvent = this.upcomingSchedule[0] ?? null;

    this.youthsSorted = [...this.youths].sort((a, b) =>
      a.fullName.localeCompare(b.fullName, 'ro'));
    this.filteredYouths = this.youthsSorted;

    this.todayLabel = this.formatDate(this.today);

    this.buildLookupMaps();
    this.buildAggregateViews();
  }

  /* ─────────────────────── Lookup map building ─────────────────────── */
  private buildLookupMaps(): void {
    for (const y of this.youths) {
      this.youthById.set(y.id, y);
      this.youthByName.set(y.fullName, y);
    }
    for (const p of this.parents) {
      this.parentById.set(p.id, p);
    }

    // Parent ↔ Team
    for (const a of this.parentAssignments) {
      let teams = this.teamsByParent.get(a.parentId);
      if (!teams) { teams = []; this.teamsByParent.set(a.parentId, teams); }
      teams.push(a.teamName);

      let parentsList = this.parentsByTeam.get(a.teamName);
      if (!parentsList) { parentsList = []; this.parentsByTeam.set(a.teamName, parentsList); }
      const p = this.parentById.get(a.parentId);
      if (p) parentsList.push(p);
    }

    // Parent ↔ Youth (children)
    for (const link of this.parentYouthLinks) {
      const youth = this.youthById.get(link.youthId);
      const parent = this.parentById.get(link.parentId);
      if (youth) {
        let arr = this.youthsForParentMap.get(link.parentId);
        if (!arr) { arr = []; this.youthsForParentMap.set(link.parentId, arr); }
        arr.push({ youth, relationship: link.relationship });
      }
      if (parent) {
        let arr = this.parentsForYouthMap.get(link.youthId);
        if (!arr) { arr = []; this.parentsForYouthMap.set(link.youthId, arr); }
        arr.push({ parent, relationship: link.relationship });
      }
    }

    // Youth ↔ Team membership
    for (const m of this.youthMemberships) {
      if (m.active) {
        let teamYouths = this.youthsByTeam.get(m.teamName);
        if (!teamYouths) { teamYouths = []; this.youthsByTeam.set(m.teamName, teamYouths); }
        const y = this.youthById.get(m.youthId);
        if (y) teamYouths.push(y);

        let activeArr = this.activeTeamsByYouth.get(m.youthId);
        if (!activeArr) { activeArr = []; this.activeTeamsByYouth.set(m.youthId, activeArr); }
        activeArr.push({ teamName: m.teamName, role: m.role });

        if (m.role === 'coordonator' && !this.coordinatorByTeam.has(m.teamName)) {
          this.coordinatorByTeam.set(m.teamName, this.youthById.get(m.youthId));
        }
      } else {
        let histArr = this.historicalTeamsByYouth.get(m.youthId);
        if (!histArr) { histArr = []; this.historicalTeamsByYouth.set(m.youthId, histArr); }
        histArr.push({ teamName: m.teamName, role: m.role, endDate: m.endDate });
      }
    }

    // Next event per team
    for (const e of this.upcomingSchedule) {
      if (!this.nextEventByTeam.has(e.team)) this.nextEventByTeam.set(e.team, e);
    }

    // Next event per parent
    for (const [parentId, teams] of this.teamsByParent) {
      const teamSet = new Set(teams);
      const ev = this.upcomingSchedule.find(e => teamSet.has(e.team));
      if (ev) this.nextEventByParent.set(parentId, ev);
    }

    // Next + all upcoming events per youth (active teams)
    for (const [youthId, activeTeams] of this.activeTeamsByYouth) {
      const teamSet = new Set(activeTeams.map(t => t.teamName));
      const upcoming = this.upcomingSchedule.filter(e => teamSet.has(e.team));
      if (upcoming.length > 0) {
        this.nextEventByYouth.set(youthId, upcoming[0]);
        this.upcomingEventsByYouth.set(youthId, upcoming);
      }
    }
  }

  /* ─────────────────────── Aggregate views ─────────────────────── */
  private buildAggregateViews(): void {
    this.nextThree = this.upcomingSchedule.slice(0, 3);
    this.upcomingByMonth = this.groupByMonth(this.upcomingSchedule, false);
    this.pastByMonth = this.groupByMonth(this.pastSchedule, true);

    let meals = 0;
    for (const e of this.pastSchedule) {
      if (e.completed && e.programType.toLowerCase().includes('tineret')) {
        meals += e.estimatedPersons || 0;
      }
    }
    this.totalMealsServed = meals;

    const coordMap = new Map<string, { name: string; team: string; count: number; color: string }>();
    for (const e of this.pastSchedule) {
      const key = `${e.coordinator}__${e.team}`;
      let entry = coordMap.get(key);
      if (!entry) {
        entry = { name: e.coordinator, team: e.team, count: 0, color: this.getTeamColor(e.team) };
        coordMap.set(key, entry);
      }
      entry.count++;
    }
    this.coordinatorRotations = Array.from(coordMap.values()).sort((a, b) => b.count - a.count);

    const month = this.today.getMonth();
    const year = this.today.getFullYear();
    let thisMonth = 0;
    for (const e of this.upcomingSchedule) {
      if (e.date.getMonth() === month && e.date.getFullYear() === year) thisMonth++;
    }
    this.scheduleStats = {
      upcoming: this.upcomingSchedule.length,
      thisMonth,
      completed: this.pastSchedule.length,
      teams: this.teamsData.length,
    };

    let coordinators = 0;
    for (const y of this.youths) if (y.isCoordinator) coordinators++;
    let thisWeek = 0;
    if (this.nextEvent) {
      thisWeek = this.youthsByTeam.get(this.nextEvent.team)?.length ?? 0;
    }
    this.youthStats = { total: this.youths.length, coordinators, thisWeek };

    this.nextParentEvent = null;
    for (const entry of this.upcomingSchedule) {
      const people = this.parentsByTeam.get(entry.team);
      if (people && people.length > 0) {
        this.nextParentEvent = { entry, people };
        break;
      }
    }
  }

  private groupByMonth(
    list: ScheduleEntry[],
    reverse: boolean,
  ): Array<{ key: string; label: string; entries: ScheduleEntry[] }> {
    const groups = new Map<string, ScheduleEntry[]>();
    const source = reverse ? [...list].reverse() : list;
    for (const e of source) {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
      let bucket = groups.get(key);
      if (!bucket) { bucket = []; groups.set(key, bucket); }
      bucket.push(e);
    }
    const out: Array<{ key: string; label: string; entries: ScheduleEntry[] }> = [];
    for (const [key, entries] of groups) {
      const [y, m] = key.split('-').map(Number);
      out.push({ key, label: `${MONTHS_LONG[m]} ${y}`, entries });
    }
    return out;
  }

  /* ─────────────────────── Date / format helpers ─────────────────────── */
  formatDate(date: Date): string {
    return `${DAYS_LONG[date.getDay()]}, ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
  }
  formatDateShort(date: Date): string {
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
  }
  getMonthShort(date: Date): string { return MONTHS_SHORT_UPPER[date.getMonth()]; }
  getWeekdayShort(date: Date): string { return DAYS_SHORT[date.getDay()]; }
  formatBirthDate(date: Date): string {
    return `${date.getDate()} ${MONTHS_LONG_LOWER[date.getMonth()]} ${date.getFullYear()}`;
  }
  formatJoinedDate(date: Date): string {
    return `${MONTHS_LONG_LOWER[date.getMonth()]} ${date.getFullYear()}`;
  }
  daysUntil(date: Date): number {
    return Math.ceil((date.getTime() - this.today.getTime()) / MS_PER_DAY);
  }
  isToday(date: Date): boolean { return date.getTime() === this.today.getTime(); }
  isThisWeek(date: Date): boolean {
    const d = this.daysUntil(date);
    return d >= 0 && d <= 7;
  }
  getAge(birthDate: Date): number {
    return Math.floor((this.today.getTime() - birthDate.getTime()) / (MS_PER_DAY * 365.25));
  }

  /* ─────────────────────── Pure helpers ─────────────────────── */
  getTeamColor(teamName: string): string { return TEAM_COLORS[teamName] || '#546e7a'; }
  getTeamIcon(teamName: string): string { return TEAM_ICONS[teamName] || 'group'; }
  getTeamNumber(teamName: string): string { return teamName.replace('Echipa ', ''); }
  getRuleIcon(index: number): string { return RULE_ICONS[index] || 'info'; }
  getPhoneHref(phone: string): string { return 'tel:+34' + phone.split(' ').join(''); }
  getEmailHref(email: string): string { return 'mailto:' + email; }

  /* ─────────────────────── Cached lookups (template-facing API preserved) ─────────────────────── */
  getYouthByName(name: string): Youth | undefined { return this.youthByName.get(name); }
  getTeamsForParent(parentId: string): string[] { return this.teamsByParent.get(parentId) ?? []; }
  getParentsForTeam(teamName: string): Parent[] { return this.parentsByTeam.get(teamName) ?? []; }
  getNextEventForParent(parentId: string): ScheduleEntry | undefined { return this.nextEventByParent.get(parentId); }
  getNextParentEvent(): { entry: ScheduleEntry; people: Parent[] } | null { return this.nextParentEvent; }
  getYouthsForParent(parentId: string): Array<{ youth: Youth; relationship: string }> {
    return this.youthsForParentMap.get(parentId) ?? [];
  }
  getActiveTeamsForYouth(youthId: string): Array<{ teamName: string; role: 'coordonator' | 'membru' }> {
    return this.activeTeamsByYouth.get(youthId) ?? [];
  }
  getHistoricalTeamsForYouth(youthId: string): Array<{ teamName: string; role: 'coordonator' | 'membru'; endDate?: Date }> {
    return this.historicalTeamsByYouth.get(youthId) ?? [];
  }
  getNextEventForYouth(youthId: string): ScheduleEntry | undefined { return this.nextEventByYouth.get(youthId); }
  getUpcomingEventsForYouth(youthId: string): ScheduleEntry[] { return this.upcomingEventsByYouth.get(youthId) ?? []; }
  getParentsForYouth(youthId: string): Array<{ parent: Parent; relationship: string }> {
    return this.parentsForYouthMap.get(youthId) ?? [];
  }
  getYouthsForTeam(teamName: string): Youth[] { return this.youthsByTeam.get(teamName) ?? []; }
  getCoordinatorForTeam(teamName: string): Youth | undefined { return this.coordinatorByTeam.get(teamName); }
  getNextDateForTeam(teamName: string): ScheduleEntry | undefined { return this.nextEventByTeam.get(teamName); }

  /* ─────────────────────── UI state mutators ─────────────────────── */
  toggleTeam(teamName: string): void {
    this.expandedTeam = this.expandedTeam === teamName ? null : teamName;
  }
  toggleParent(parentId: string): void {
    this.expandedParentId = this.expandedParentId === parentId ? null : parentId;
  }
  toggleYouth(youthId: string): void {
    this.expandedYouthId = this.expandedYouthId === youthId ? null : youthId;
  }
  setYouthFilter(f: 'toti' | 'coordonatori' | 'membri'): void {
    if (this.youthFilter === f) return;
    this.youthFilter = f;
    this.recomputeFilteredYouths();
  }

  private recomputeFilteredYouths(): void {
    const term = this._youthSearch.trim().toLowerCase();
    const filter = this.youthFilter;
    if (!term && filter === 'toti') {
      this.filteredYouths = this.youthsSorted;
    } else {
      this.filteredYouths = this.youthsSorted.filter(y => {
        if (filter === 'coordonatori' && !y.isCoordinator) return false;
        if (filter === 'membri' && y.isCoordinator) return false;
        if (term && !y.fullName.toLowerCase().includes(term)) return false;
        return true;
      });
    }
    this.cdr.markForCheck();
  }

  /* ─────────────────────── Navigation ─────────────────────── */
  goTo(target: 'team' | 'youth' | 'parent', id: string, ev?: Event): void {
    if (ev) ev.stopPropagation();
    if (target === 'team') {
      this.activeTab = 1;
      this.expandedTeam = id;
    } else if (target === 'youth') {
      this.activeTab = 2;
      this.expandedYouthId = id;
    } else if (target === 'parent') {
      this.activeTab = 3;
      this.expandedParentId = id;
    }
    setTimeout(() => {
      const el = document.getElementById(`card-${target}-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('flash-highlight');
        setTimeout(() => el.classList.remove('flash-highlight'), 1600);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 220);
  }

  trackByYouthId = (_: number, y: { id: string }) => y.id;
  trackByParentId = (_: number, p: { id: string }) => p.id;
  trackByTeamName = (_: number, t: { name: string }) => t.name;
  trackByTeamHistName = (_: number, t: { name: string }) => t.name;
  trackByScheduleDate = (_: number, e: { date: Date; team: string }) => e.date.getTime() + '|' + e.team;
  trackByMonthKey = (_: number, g: { key: string }) => g.key;
  trackByIndex = (i: number) => i;
  trackByCoordKey = (_: number, c: { name: string; team: string }) => c.name + '|' + c.team;
  trackByTeamNameStr = (_: number, s: string) => s;
  trackByYouthLink = (_: number, x: { youth: { id: string } }) => x.youth.id;
  trackByParentLink = (_: number, x: { parent: { id: string } }) => x.parent.id;
  trackByActiveTeam = (_: number, t: { teamName: string }) => t.teamName;
  trackByMember = (_: number, m: { name: string }) => m.name;
}
