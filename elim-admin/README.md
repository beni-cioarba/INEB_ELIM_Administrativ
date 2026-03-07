# ELIM Arganda - Programare Tineret

Pagina web pentru programarea pregătirii mesei la departamentul de tineret al Bisericii ELIM - Arganda del Rey.

## Funcționalități

- **Programare** - Vizualizarea programărilor viitoare cu countdown. Istoricul evenimentelor trecute (colapsabil).
- **Echipe** - Rezumat cu toate echipele, coordonatori, membri și numere de telefon.
- **Reguli** - Regulile și pregătirile necesare pentru fiecare eveniment.
- 100% responsive (mobil, tabletă, desktop).

## Dezvoltare locală

```bash
cd elim-admin
npm install
npx ng serve
```

Deschide http://localhost:4200/ în browser.

## Publicare pe GitHub Pages

### Metoda 1: GitHub Actions (automată)

1. Creează un repository pe GitHub (ex: `INEB_ELIM_Administrativ`).
2. Push codul în branch-ul `main`.
3. În Settings > Pages, selectează sursa: **GitHub Actions**.
4. Workflow-ul din `.github/workflows/deploy.yml` va construi și publica automat.
5. **Important**: Actualizează `--base-href` din workflow dacă numele repository-ului este diferit.

### Metoda 2: Manuală cu gh-pages

```bash
cd elim-admin
npm install -g angular-cli-ghpages
npx ng build --base-href /INEB_ELIM_Administrativ/
npx angular-cli-ghpages --dir=dist/elim-admin/browser
```

## Actualizare date

Datele sunt în fișierul `src/app/data/schedule-data.ts`. Editează:
- `SCHEDULE_DATA` - pentru programări
- `TEAMS_DATA` - pentru componența echipelor
- `RULES` - pentru regulile echipelor
