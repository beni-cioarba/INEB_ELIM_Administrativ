import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventNotesService } from '../../core/services/event-notes.service';
import { formatDate } from '../../core/utils/date.utils';
import { getTeamColor, getTeamNumber } from '../../core/utils/team.utils';

@Component({
  selector: 'app-event-notes-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (notes.openEntry(); as entry) {
      <div class="evnotes-backdrop" (click)="close()"></div>
      <div class="evnotes-dialog" role="dialog" aria-modal="true">
        <div class="evnotes-header"
             [style.background]="'linear-gradient(135deg, ' + teamColor() + ', ' + teamColor() + 'cc)'">
          <div class="evnotes-num">{{ teamNum() }}</div>
          <div class="evnotes-title">
            <span class="evnotes-team">{{ entry.team }}</span>
            <span class="evnotes-date">
              <span class="material-symbols-rounded">event</span>
              {{ format(entry.date) }}
            </span>
          </div>
          <button type="button" class="evnotes-close" (click)="close()" aria-label="Închide">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
        <div class="evnotes-body">
          <div class="evnotes-meta">
            <span class="evnotes-pill">
              <span class="material-symbols-rounded">person</span>
              {{ entry.coordinator }}
            </span>
            <span class="evnotes-pill">
              <span class="material-symbols-rounded">restaurant</span>
              {{ entry.estimatedPersons }} persoane
            </span>
            <span class="evnotes-pill">
              <span class="material-symbols-rounded">celebration</span>
              {{ entry.programType }}
            </span>
            @if (entry.completed) {
              <span class="evnotes-pill done">
                <span class="material-symbols-rounded">check_circle</span>
                Finalizat
              </span>
            }
          </div>

          @if (entry.observations) {
            <div class="evnotes-section">
              <div class="evnotes-label">
                <span class="material-symbols-rounded">sticky_note_2</span>
                Notițe
              </div>
              <p class="evnotes-personal">{{ entry.observations }}</p>
            </div>
          } @else {
            <p class="evnotes-empty">Nu există notițe pentru această programare.</p>
          }
        </div>
      </div>
    }
  `,
})
export class EventNotesDialogComponent {
  protected readonly notes = inject(EventNotesService);
  protected readonly format = formatDate;

  teamColor = computed(() => {
    const e = this.notes.openEntry();
    return e ? getTeamColor(e.team) : '#1565c0';
  });
  teamNum = computed(() => {
    const e = this.notes.openEntry();
    return e ? getTeamNumber(e.team) : '';
  });

  close(): void { this.notes.close(); }
}
