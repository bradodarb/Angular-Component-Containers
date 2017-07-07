
import {
  Injectable
} from '@angular/core';

import { ComponentMap } from '../lib/component-map';

@Injectable()
export class ComponentMapService {
  public maps: Map<any, ComponentMap>;
  constructor() {
    this.maps = new Map()
  }

  get(key: any): ComponentMap | null {
    if (this.maps.has(key)) {
      return this.maps.get(key);
    } else {
      throw new Error('No ComponentMap found with key (' + key + ')');
    }

  }

  set(key: any, map: ComponentMap) {
    if (!!key && !!map) {
      this.maps.set(key, map);
    } else {
      throw new Error('Invalid Key/Map combination');
    }
  }

}
