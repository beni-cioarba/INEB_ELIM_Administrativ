import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SCHEDULE_DATA, TEAMS_DATA, RULES, ScheduleEntry, Team } from './data/schedule-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  scheduleData = SCHEDULE_DATA;
  teamsData = TEAMS_DATA;
  rules = RULES;

  upcomingSchedule: ScheduleEntry[] = [];
  pastSchedule: ScheduleEntry[] = [];
  nextEvent: ScheduleEntry | null = null;

  activeSection: 'schedule' | 'teams' | 'rules' = 'schedule';
  showPastSchedule = false;
  expandedTeam: string | null = null;

  today = new Date();

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.categorizeSchedule();
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

  daysUntil(date: Date): number {
    const diff = date.getTime() - this.today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getTeamColor(teamName: string): string {
    const colors: Record<string, string> = {
      'Echipa 1': '#2563eb',
      'Echipa 2': '#7c3aed',
      'Echipa 3': '#059669',
      'Echipa 4': '#d97706',
      'Echipa 5': '#dc2626',
      'Echipa 6': '#0891b2',
      'Echipa 7': '#be185d',
    };
    return colors[teamName] || '#6b7280';
  }

  getTeamForEntry(entry: ScheduleEntry): Team | undefined {
    return this.teamsData.find(t => t.name === entry.team);
  }

  toggleTeam(teamName: string): void {
    this.expandedTeam = this.expandedTeam === teamName ? null : teamName;
  }

  getNextDateForTeam(teamName: string): ScheduleEntry | undefined {
    return this.upcomingSchedule.find(e => e.team === teamName);
  }

  getTeamNumber(teamName: string): string {
    return teamName.replace('Echipa ', '');
  }

  setSection(section: 'schedule' | 'teams' | 'rules'): void {
    this.activeSection = section;
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
}
