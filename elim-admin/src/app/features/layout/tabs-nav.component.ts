import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { TAB_PATHS } from '../../core/constants';

interface NavTab {
  path: string;
  icon: string;
  label: string;
  exact: boolean;
}

/**
 * Router-aware tab bar.
 *
 * Uses `<nav mat-tab-nav-bar>` + `<a mat-tab-link>` instead of `<mat-tab-group>`,
 * because the latter renders animated tab *panels* (which we don't need — the
 * `<router-outlet>` provides the content). Using `mat-tab-group` for routed
 * navigation caused panel-animation churn and freezes when switching rapidly.
 */
@Component({
  selector: 'app-tabs-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabsModule, RouterLink, RouterLinkActive],
  host: { 
    'class': 'nav-container',
    'style': 'display: block; position: sticky; top: 0; z-index: 100;'
  },
  template: `
    <nav mat-tab-nav-bar
         [tabPanel]="tabPanel"
         class="nav-tabs"
         mat-stretch-tabs="true"
         disablePagination>
      @for (t of tabs; track t.path) {
        <a mat-tab-link
           #rla="routerLinkActive"
           [routerLink]="['/' + t.path]"
           routerLinkActive
           [routerLinkActiveOptions]="{ exact: t.exact }"
           [active]="rla.isActive">
          <span class="material-symbols-rounded tab-icon">{{ t.icon }}</span>
          <span class="tab-label">{{ t.label }}</span>
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
  `,
})
export class TabsNavComponent {
  readonly tabs: NavTab[] = [
    { path: TAB_PATHS.schedule, icon: 'calendar_month',  label: 'Programare', exact: true },
    { path: TAB_PATHS.teams,    icon: 'groups',          label: 'Echipe',     exact: false },
    { path: TAB_PATHS.youths,   icon: 'school',          label: 'Tineri',     exact: false },
    { path: TAB_PATHS.parents,  icon: 'family_restroom', label: 'Părinți',    exact: false },
    { path: TAB_PATHS.rules,    icon: 'menu_book',       label: 'Reguli',     exact: false },
  ];
}
