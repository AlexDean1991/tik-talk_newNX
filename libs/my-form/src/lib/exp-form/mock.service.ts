import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

export interface Feature {
  code: string
  label: string
  value: boolean
}

@Injectable({ providedIn: 'root' })
export class MockService {

  getAddresses(): Observable<{
    city: string | undefined;
    street: string | undefined;
    building: number | undefined;
    apartment: number | undefined; }[]> {
    const addresses = [
      {
        city: 'New York',
        street: '5th Avenue',
        building: 1,
        apartment: 101
      },
    ];

    return of(addresses);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: true
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: true
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false
      },
    ])
  }
}
