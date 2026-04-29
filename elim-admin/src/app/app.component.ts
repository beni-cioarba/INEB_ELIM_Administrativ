import { Component, OnInit } from '@angular/core';
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
  Team,
  TeamHistory,
  Parent,
  Youth,
  ParentYouthLink,
} from './data/schedule-data';

@Component({
  selector: 'app-root',
  standalone: true,
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
  scheduleData = SCHEDULE_DATA;
  teamsData = TEAMS_DATA;
  teamsHistory = TEAMS_HISTORY;
  rules = RULES;
  parents = PARENTS;
  parentAssignments = PARENT_TEAM_ASSIGNMENTS;
  parentYouthLinks = PARENT_YOUTH_LINKS;
  youths = YOUTHS;
  youthMemberships = YOUTH_TEAM_MEMBERSHIPS;

  // Tineri sortaţi alfabetic pentru afișare
  youthsSorted: Youth[] = [];

  upcomingSchedule: ScheduleEntry[] = [];
  pastSchedule: ScheduleEntry[] = [];
  nextEvent: ScheduleEntry | null = null;

  activeTab = 0;
  showPastSchedule = false;
  showTeamHistory = false;
  expandedTeam: string | null = null;
  expandedParentId: string | null = null;
  expandedYouthId: string | null = null;
  youthFilter: 'toti' | 'coordonatori' | 'membri' = 'toti';
  youthSearch = '';

  today = new Date();

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.categorizeSchedule();
    this.youthsSorted = [...this.youths].sort((a, b) =>
      a.fullName.localeCompare(b.fullName, 'ro'));
  }

  categorizeSchedule(): void {
    const sorted = [...this.scheduleData].sort((a, b) => a.date.getTime() - b.date.getTime());
    this.pastSchedule = sorted.filter(e => e.date < this.today);
    this.upcomingSchedule = sorted.filter(e => e.date >= this.today);
    if (this.upcomingSchedule.length > 0) {
      this.nextEvent = this.upcomingSchedule[0];
    }
  }

  formatDate(date: Date): string {
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatDateShort(date: Date): string {
    const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getMonthShort(date: Date): string {
    const months = ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[date.getMonth()];
  }

  getWeekdayShort(date: Date): string {
    const days = ['DUM', 'LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SÂM'];
    return days[date.getDay()];
  }

  daysUntil(date: Date): number {
    const diff = date.getTime() - this.today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getTeamColor(teamName: string): string {
    const colors: Record<string, string> = {
      'Echipa 1': '#1565c0',
      'Echipa 2': '#6a1b9a',
      'Echipa 3': '#2e7d32',
      'Echipa 4': '#e65100',
      'Echipa 5': '#c62828',
      'Echipa 6': '#00838f',
      'Echipa 7': '#ad1457',
    };
    return colors[teamName] || '#546e7a';
  }

  getTeamIcon(teamName: string): string {
    const icons: Record<string, string> = {
      'Echipa 1': 'looks_one',
      'Echipa 2': 'looks_two',
      'Echipa 3': 'looks_3',
      'Echipa 4': 'looks_4',
      'Echipa 5': 'looks_5',
      'Echipa 6': 'looks_6',
      'Echipa 7': 'filter_7',
    };
    return icons[teamName] || 'group';
  }

  toggleTeam(teamName: string): void {
    this.expandedTeam = this.expandedTeam === teamName ? null : teamName;
  }

  /** Găsește un tânăr după numele complet (folosit pentru cross-link din rezumat coordonatori). */
  getYouthByName(name: string): Youth | undefined {
    return this.youths.find(y => y.fullName === name);
  }

  /** Navighează la profilul unei echipe / tânăr / părinte și deschide cardul cu scroll lin. */
  goTo(target: 'team' | 'youth' | 'parent', id: string, ev?: Event): void {
    if (ev) { ev.stopPropagation(); }
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
    // Așteaptă render-ul tab-ului apoi scroll smooth la card.
    setTimeout(() => {
      const el = document.getElementById(`card-${target}-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('flash-highlight');
        setTimeout(() => el.classList.remove('flash-highlight'), 1600);
      } else {
        // fallback: scroll la top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 220);
  }

  getNextDateForTeam(teamName: string): ScheduleEntry | undefined {
    return this.upcomingSchedule.find(e => e.team === teamName);
  }

  getTeamNumber(teamName: string): string {
    return teamName.replace('Echipa ', '');
  }

  isToday(date: Date): boolean {
    return date.getTime() === this.today.getTime();
  }

  isThisWeek(date: Date): boolean {
    const diff = this.daysUntil(date);
    return diff >= 0 && diff <= 7;
  }

  getPhoneHref(phone: string): string {
    return 'tel:+34' + phone.split(' ').join('');
  }

  getRuleIcon(index: number): string {
    return ['person', 'checklist', 'schedule', 'cleaning_services'][index] || 'info';
  }

  /* ===== PĂRINȚI (anterior „Sprijin") ===== */

  /** Echipele atribuite unui părinte. */
  getTeamsForParent(parentId: string): string[] {
    return this.parentAssignments
      .filter(a => a.parentId === parentId)
      .map(a => a.teamName);
  }

  /** Părinții alocați unei echipe. */
  getParentsForTeam(teamName: string): Parent[] {
    const ids = this.parentAssignments
      .filter(a => a.teamName === teamName)
      .map(a => a.parentId);
    return this.parents.filter(p => ids.includes(p.id));
  }

  /** Următoarea programare pentru un părinte. */
  getNextEventForParent(parentId: string): ScheduleEntry | undefined {
    const teams = this.getTeamsForParent(parentId);
    if (teams.length === 0) return undefined;
    return this.upcomingSchedule.find(e => teams.includes(e.team));
  }

  /** Următorul eveniment global pentru oricare părinte (hero card). */
  getNextParentEvent(): { entry: ScheduleEntry; people: Parent[] } | null {
    for (const entry of this.upcomingSchedule) {
      const people = this.getParentsForTeam(entry.team);
      if (people.length > 0) return { entry, people };
    }
    return null;
  }

  toggleParent(parentId: string): void {
    this.expandedParentId = this.expandedParentId === parentId ? null : parentId;
  }

  /** Tinerii legați de un părinte (copii). */
  getYouthsForParent(parentId: string): Array<{ youth: Youth; relationship: string }> {
    return this.parentYouthLinks
      .filter(l => l.parentId === parentId)
      .map(l => ({
        youth: this.youths.find(y => y.id === l.youthId)!,
        relationship: l.relationship,
      }))
      .filter(x => !!x.youth);
  }

  /* ===== TINERI ===== */

  toggleYouth(youthId: string): void {
    this.expandedYouthId = this.expandedYouthId === youthId ? null : youthId;
  }

  setYouthFilter(f: 'toti' | 'coordonatori' | 'membri'): void {
    this.youthFilter = f;
  }

  /** Listele filtrate și căutate pentru ecranul Tineri. */
  get filteredYouths(): Youth[] {
    const term = this.youthSearch.trim().toLowerCase();
    return this.youthsSorted.filter(y => {
      if (this.youthFilter === 'coordonatori' && !y.isCoordinator) return false;
      if (this.youthFilter === 'membri' && y.isCoordinator) return false;
      if (term && !y.fullName.toLowerCase().includes(term)) return false;
      return true;
    });
  }

  /** Echipele active ale unui tânăr. */
  getActiveTeamsForYouth(youthId: string): Array<{ teamName: string; role: 'coordonator' | 'membru' }> {
    return this.youthMemberships
      .filter(m => m.youthId === youthId && m.active)
      .map(m => ({ teamName: m.teamName, role: m.role }));
  }

  /** Echipele istorice (anterioare) ale unui tânăr. */
  getHistoricalTeamsForYouth(youthId: string): Array<{ teamName: string; role: 'coordonator' | 'membru'; endDate?: Date }> {
    return this.youthMemberships
      .filter(m => m.youthId === youthId && !m.active)
      .map(m => ({ teamName: m.teamName, role: m.role, endDate: m.endDate }));
  }

  /** Următoarea programare pentru un tânăr (oricare echipă activă). */
  getNextEventForYouth(youthId: string): ScheduleEntry | undefined {
    const teams = this.getActiveTeamsForYouth(youthId).map(t => t.teamName);
    if (teams.length === 0) return undefined;
    return this.upcomingSchedule.find(e => teams.includes(e.team));
  }

  /** Toate programrile viitoare ale unui tânăr. */
  getUpcomingEventsForYouth(youthId: string): ScheduleEntry[] {
    const teams = this.getActiveTeamsForYouth(youthId).map(t => t.teamName);
    if (teams.length === 0) return [];
    return this.upcomingSchedule.filter(e => teams.includes(e.team));
  }

  /** Părinții unui tânăr. */
  getParentsForYouth(youthId: string): Array<{ parent: Parent; relationship: string }> {
    return this.parentYouthLinks
      .filter(l => l.youthId === youthId)
      .map(l => ({
        parent: this.parents.find(p => p.id === l.parentId)!,
        relationship: l.relationship,
      }))
      .filter(x => !!x.parent);
  }

  /** Vârsta unui tânăr. */
  getAge(birthDate: Date): number {
    const diff = this.today.getTime() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  /** Statistici scurte pentru hero-ul ecranului Tineri. */
  get youthStats(): { total: number; coordinators: number; thisWeek: number } {
    const total = this.youths.length;
    const coordinators = this.youths.filter(y => y.isCoordinator).length;
    // tineri implicați în evenimentul săptămânii curente
    const next = this.nextEvent;
    let thisWeek = 0;
    if (next) {
      const ids = new Set(
        this.youthMemberships
          .filter(m => m.active && m.teamName === next.team)
          .map(m => m.youthId)
      );
      thisWeek = ids.size;
    }
    return { total, coordinators, thisWeek };
  }

  formatBirthDate(date: Date): string {
    const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
      'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatJoinedDate(date: Date): string {
    const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
      'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getEmailHref(email: string): string {
    return 'mailto:' + email;
  }

  /* ===== HOME (Programare) — helpers de rezumat ===== */

  /** Echipele active ale unui tânăr după nume (folosit în Echipe & Home). */
  getYouthsForTeam(teamName: string): Youth[] {
    const ids = this.youthMemberships
      .filter(m => m.teamName === teamName && m.active)
      .map(m => m.youthId);
    return this.youths.filter(y => ids.includes(y.id));
  }

  /** Coordonatorul activ al unei echipe (Youth). */
  getCoordinatorForTeam(teamName: string): Youth | undefined {
    const m = this.youthMemberships.find(m => m.teamName === teamName && m.active && m.role === 'coordonator');
    return m ? this.youths.find(y => y.id === m.youthId) : undefined;
  }

  /** Statistici globale pentru hero-ul de pe Home. */
  get scheduleStats(): { upcoming: number; thisMonth: number; completed: number; teams: number } {
    const upcoming = this.upcomingSchedule.length;
    const completed = this.pastSchedule.length;
    const month = this.today.getMonth();
    const year = this.today.getFullYear();
    const thisMonth = this.upcomingSchedule.filter(e =>
      e.date.getMonth() === month && e.date.getFullYear() === year
    ).length;
    return { upcoming, thisMonth, completed, teams: this.teamsData.length };
  }

  /** Top 3 următoare evenimente (pentru previzualizare). */
  get nextThree(): ScheduleEntry[] {
    return this.upcomingSchedule.slice(0, 3);
  }

  /** Programări viitoare după luna calendaristică. */
  get upcomingByMonth(): Array<{ key: string; label: string; entries: ScheduleEntry[] }> {
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    const groups = new Map<string, ScheduleEntry[]>();
    for (const e of this.upcomingSchedule) {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    }
    return Array.from(groups.entries()).map(([key, entries]) => {
      const [y, m] = key.split('-').map(Number);
      return { key, label: `${months[m]} ${y}`, entries };
    });
  }

  /** Istoric grupat invers cronologic după lună. */
  get pastByMonth(): Array<{ key: string; label: string; entries: ScheduleEntry[] }> {
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    const groups = new Map<string, ScheduleEntry[]>();
    for (const e of [...this.pastSchedule].reverse()) {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    }
    return Array.from(groups.entries()).map(([key, entries]) => {
      const [y, m] = key.split('-').map(Number);
      return { key, label: `${months[m]} ${y}`, entries };
    });
  }

  /** Numărul total de mese pregătite la programele de tineret finalizate. */
  get totalMealsServed(): number {
    return this.pastSchedule
      .filter(e => e.completed && e.programType.toLowerCase().includes('tineret'))
      .reduce((sum, e) => sum + (e.estimatedPersons || 0), 0);
  }

  /** Câte rotații a coordonat un coordonator în istoric (pentru rezumat). */
  get coordinatorRotations(): Array<{ name: string; team: string; count: number; color: string }> {
    const map = new Map<string, { name: string; team: string; count: number; color: string }>();
    for (const e of this.pastSchedule) {
      const key = `${e.coordinator}__${e.team}`;
      if (!map.has(key)) {
        map.set(key, { name: e.coordinator, team: e.team, count: 0, color: this.getTeamColor(e.team) });
      }
      map.get(key)!.count++;
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }

  /** Numele de zile / luna curentă pentru hero. */
  get todayLabel(): string {
    return this.formatDate(this.today);
  }
}
