
import {

  Injectable, Component, ViewContainerRef, ElementRef,
  ComponentFactoryResolver, ComponentRef, ComponentFactory
} from '@angular/core';

import { ComponentMap } from '../lib/component-map';

@Injectable()
export class ComponentInjectorService {
  public factories = new Map();
  private componentFactoryResolver: ComponentFactoryResolver;
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    this.componentFactoryResolver = componentFactoryResolver;
  }

  injectInto(component, target: ViewContainerRef, index: number = 0): ComponentRef<any> {
    let factory = this.factories.get(component);
    if (!factory) {
      factory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.factories.set(component, factory);
    }

    const result = target.createComponent(factory, index);
    return result;

  }

  static map: ComponentMap = new ComponentMap();

}
