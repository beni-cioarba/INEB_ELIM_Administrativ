import { Injectable } from '@angular/core';
import { GalleryItem } from './atm-gallery.models';
import { MOCK_GALLERY_DATA } from './mock-gallery.data';

/**
 * Servicio read-only basado únicamente en mocks.
 * No persiste estado ni permite mutaciones.
 */
@Injectable({ providedIn: 'root' })
export class GalleryService {
  getByKeyGroup(keyGroup: string): GalleryItem[] {
    const items = MOCK_GALLERY_DATA[keyGroup] ?? [];
    return items
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(i => ({
        ...i,
        thumbnailImageSrc: i.thumbnailImageSrc || i.itemImageSrc,
      }));
  }
}
