import { GalleryItem } from './atm-gallery.models';

/**
 * Mocks iniciales de imágenes de equipos.
 * Las claves coinciden con `team.name` (ej. "Echipa 1").
 *
 * Para añadir nuevas imágenes manualmente, sustituye `itemImageSrc` por un
 * data-URL en base64:
 *   "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABI...."
 */
export const MOCK_GALLERY_DATA: Record<string, GalleryItem[]> = {
  'Echipa 1': [
    {
      id: 'mock-e1-1',
      keyGroup: 'Echipa 1',
      title: 'Întâlnirea de tineret',
      description: 'Pregătire pentru programul de sâmbătă',
      itemImageSrc: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
      thumbnailImageSrc: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=160&q=70',
      isDefault: true,
      sortOrder: 0,
      uploadedAt: '2026-04-12T18:30:00.000Z',
    },
    {
      id: 'mock-e1-2',
      keyGroup: 'Echipa 1',
      title: 'Echipa în slujire',
      description: 'Servirea mesei comune',
      itemImageSrc: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      thumbnailImageSrc: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=160&q=70',
      sortOrder: 1,
      uploadedAt: '2026-04-19T18:30:00.000Z',
    },
  ],
  'Echipa 2': [
    {
      id: 'mock-e2-1',
      keyGroup: 'Echipa 2',
      title: 'Activitate Echipa 2',
      description: 'Moment de părtășie',
      itemImageSrc: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80',
      thumbnailImageSrc: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=160&q=70',
      isDefault: true,
      sortOrder: 0,
      uploadedAt: '2026-03-05T19:00:00.000Z',
    },
  ],
};
