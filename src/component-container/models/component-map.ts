
import { Component } from '@angular/core';

export class ComponentMap {

  private map = new Map();
  constructor(map?: Array<ComponentMapItem>) {
    if (!!map) {
      this.init(map);
    }
  }
  public init(map: Array<ComponentMapItem>) {
    this.map.clear();
    map.forEach(item => {
      this.map.set(item.model, item.component);
    });
  }

  public register(model, component) {
    this.map.set(model, component);
  }

  public getComponent(key) {
    if (!!key) {
      return this.map.get(key);
    }
  }

  static build(map: Array<ComponentMapItem>) {
    const result = new ComponentMap(map);
    return result;
  }
}

export interface ComponentMapItem {
  model: any,
  component: Component
}
