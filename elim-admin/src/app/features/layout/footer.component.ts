import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <img src="assets/logo-elim.png" alt="Logo Biserica ELIM" class="footer-logo footer-logo-elim">
        <div class="footer-text">
          <p>Biserica ELIM &mdash; Arganda del Rey &copy; {{ year }}</p>
          <p class="footer-sub">Departament Administrativ Tineret</p>
        </div>
        <img src="assets/logo-ineb.png" alt="Logo INEB" class="footer-logo footer-logo-ineb">
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = inject(DataService).today.getFullYear();
}
