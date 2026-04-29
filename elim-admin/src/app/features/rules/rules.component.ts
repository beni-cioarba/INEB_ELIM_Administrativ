import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../core/services/data.service';

interface RuleSection {
  tone: 'primary' | 'success' | 'info' | 'warn';
  num: number;
  icon: string;
  eyebrow: string;
  title: string;
  items: string[];
}

@Component({
  selector: 'app-rules',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="rules-hero">
      <div class="rules-hero-icon">
        <span class="material-symbols-rounded">menu_book</span>
      </div>
      <div class="rules-hero-text">
        <h2 class="rules-hero-title">Ghid pentru pregătirea mesei</h2>
        <p class="rules-hero-sub">Responsabilități și pași esențiali pentru fiecare echipă din departamentul de tineret.</p>
      </div>
    </div>

    <div class="rules-meta-row">
      <div class="rules-meta-pill">
        <span class="material-symbols-rounded">workspaces</span>
        4 secțiuni
      </div>
      <div class="rules-meta-pill">
        <span class="material-symbols-rounded">checklist_rtl</span>
        Reguli de aplicat
      </div>
      <div class="rules-meta-pill">
        <span class="material-symbols-rounded">groups</span>
        Pentru toate echipele
      </div>
    </div>

    <div class="rules-grid">
      @for (s of sections; track s.num) {
        <mat-card class="rule-card-pro" appearance="outlined">
          <div class="rule-card-head" [attr.data-tone]="s.tone">
            <div class="rule-card-num">{{ s.num }}</div>
            <div class="rule-card-icon">
              <span class="material-symbols-rounded">{{ s.icon }}</span>
            </div>
            <div class="rule-card-title-block">
              <span class="rule-card-eyebrow">{{ s.eyebrow }}</span>
              <h3 class="rule-card-title">{{ s.title }}</h3>
            </div>
          </div>
          <div class="rule-card-body">
            <ol class="rule-steps">
              @for (item of s.items; track $index) {
                <li>
                  <span class="rule-step-num">{{ $index + 1 }}</span>
                  <span class="rule-step-text">{{ item }}</span>
                </li>
              }
            </ol>
          </div>
        </mat-card>
      }
    </div>
  `,
})
export class RulesComponent {
  private readonly r = inject(DataService).rules;
  readonly sections: RuleSection[] = [
    { tone: 'primary', num: 1, icon: 'person',             eyebrow: 'Rol',         title: this.r.coordinatorRole.title,         items: this.r.coordinatorRole.items },
    { tone: 'success', num: 2, icon: 'checklist',          eyebrow: 'Organizare',  title: this.r.coordinatorOrganization.title, items: this.r.coordinatorOrganization.items },
    { tone: 'info',    num: 3, icon: 'schedule',           eyebrow: 'Înainte',     title: this.r.beforeProgram.title,           items: this.r.beforeProgram.items },
    { tone: 'warn',    num: 4, icon: 'cleaning_services',  eyebrow: 'După',        title: this.r.afterProgram.title,            items: this.r.afterProgram.items },
  ];
}
