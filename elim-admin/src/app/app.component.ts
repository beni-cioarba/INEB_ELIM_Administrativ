import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SCHEDULE_DATA, TEAMS_DATA, TEAMS_HISTORY, RULES, ScheduleEntry, Team, TeamHistory } from './data/schedule-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
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

  upcomingSchedule: ScheduleEntry[] = [];
  pastSchedule: ScheduleEntry[] = [];
  nextEvent: ScheduleEntry | null = null;

  activeTab = 0;
  showPastSchedule = false;
  showTeamHistory = false;
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

  getMonthShort(date: Date): string {
    const months = ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[date.getMonth()];
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
}
