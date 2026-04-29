import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../core/services/data.service';
import { NavigationService } from '../../core/services/navigation.service';
import { EventNotesService } from '../../core/services/event-notes.service';
import { ScheduleEntry } from '../../core/models';
import {
  formatDate, formatDateShort, getMonthShort, daysBetween, isSameDay,
} from '../../core/utils/date.utils';
import { getTeamColor, getTeamNumber } from '../../core/utils/team.utils';
import { DAYS_LETTER } from '../../core/constants';

@Component({
  selector: 'app-schedule',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatCardModule, MatButtonModule,
    MatDividerModule, MatRippleModule, MatTooltipModule,
  ],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  protected readonly data = inject(DataService);
  protected readonly nav = inject(NavigationService);
  protected readonly notes = inject(EventNotesService);

  openNotes(entry: ScheduleEntry, ev: Event): void {
    ev.stopPropagation();
    this.notes.open(entry);
  }

  readonly showPastSchedule = signal(false);
  readonly DAYS_LETTER = DAYS_LETTER;

  readonly topCoordinators = this.data.coordinatorRotations.slice(0, 8);

  /* Template helpers — imported pure functions wired with `today`. */
  protected readonly formatDate = formatDate;
  protected readonly formatDateShort = formatDateShort;
  protected readonly getMonthShort = getMonthShort;
  protected readonly getTeamColor = getTeamColor;
  protected readonly getTeamNumber = getTeamNumber;

  daysUntil(date: Date): number { return daysBetween(date, this.data.today); }
  isToday(date: Date): boolean { return isSameDay(date, this.data.today); }
  isThisWeek(date: Date): boolean {
    const d = this.daysUntil(date);
    return d >= 0 && d <= 7;
  }

  goToCoord(name: string): void {
    const y = this.data.getYouthByName(name);
    if (y) this.nav.goTo('youth', y.id);
  }
}
