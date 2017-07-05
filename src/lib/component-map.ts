
import { Component } from '@angular/core';

export class ComponentMap {

  private map: Map<any, Component> = new Map();
  constructor(map?: Array<ComponentMapItem>) {
    if (!!map) {
      this.init(map);
    }
  }
  public init(map: Array<ComponentMapItem>): void {
    this.map.clear();
    map.forEach(item => {
      this.map.set(item.model, item.component);
    });
  }

  public register(model: any, component: Component): void {
    this.map.set(model, component);
  }

  public getComponent(key): Component {
    if (!!key) {
      return this.map.get(key);
    }
  }

  static build(map: Array<ComponentMapItem>): ComponentMap {
    const result = new ComponentMap(map);
    return result;
  }
}

export interface ComponentMapItem {
  model: any,
  component: Component
}
