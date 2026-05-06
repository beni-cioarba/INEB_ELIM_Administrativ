import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../core/services/data.service';
import { formatDate, getMonthShort, getWeekdayShort } from '../../core/utils/date.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatTooltipModule],
  template: `
    <mat-toolbar class="header-toolbar" color="primary">
      <div class="header-content">
        <div class="header-top">
          <a routerLink="/" class="logo-group-link" aria-label="Înapoi la Panoul principal (Programare)">
            <div class="logo-frame">
              <img src="assets/logo-elim.png" alt="Logo Biserica ELIM" class="header-logo">
            </div>
            <div class="logo-frame">
              <img src="assets/logo_admin-192.png" alt="Logo Departament Administrativ" class="header-logo">
            </div>
            <div class="header-divider" aria-hidden="true"></div>
            <div class="header-text">
              <h1 class="church-name">Departament de Tineret</h1>
              <p class="header-tagline">
                <span class="material-symbols-rounded tagline-icon">restaurant</span>
                Programarea pregătirii mesei
              </p>
            </div>
          </a>
          <div class="header-today" [matTooltip]="'Astăzi: ' + todayLabel">
            <div class="header-today-text">
              <span class="header-today-dow">{{ wd }}</span>
              <span class="header-today-day">{{ today.getDate() }}</span>
              <span class="header-today-mo">{{ mo }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="header-accent-bar" aria-hidden="true"></div>
    </mat-toolbar>
  `,
})
export class HeaderComponent {
  private readonly data = inject(DataService);
  readonly today = this.data.today;
  readonly todayLabel = formatDate(this.today);
  readonly wd = getWeekdayShort(this.today);
  readonly mo = getMonthShort(this.today);
}
