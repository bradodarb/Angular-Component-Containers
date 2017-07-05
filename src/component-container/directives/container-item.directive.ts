
import { Component, Directive, Input, ViewContainerRef, OnChanges, ComponentRef } from '@angular/core';
import { ComponentInjectorService } from '../services/component-injector.service';
import { ComponentMap } from '../models/component-map';


@Directive({ selector: '[container-item]' })
export class ContainerItemDirective implements OnChanges {

  @Input() context: Component;

  @Input() map: ComponentMap = new ComponentMap();

  private injector: ComponentInjectorService;
  private host: ViewContainerRef;
  private current: ComponentRef<any>;

  constructor(injector: ComponentInjectorService, host: ViewContainerRef) {
    this.injector = injector;
    this.host = host;
  }


  private resolveContext() {
    this.destroyContext();
    if (this.context) {
      let component = null;
      const targetType = Object.getPrototypeOf(this.context).constructor;

      if (this.map) {
        component = this.map.getComponent(targetType);
      }

      if (!component) {
        if (ComponentInjectorService.map) {
          component = ComponentInjectorService.map.getComponent(targetType);
        }
      }

      if (!!component) {
        this.current = this.injector.injectInto(component, this.host);
        this.current.instance.context = this.context;
      }
    }
  }

  private destroyContext() {
    if (this.current) {
      this.current.destroy();
    }
  }

  ngOnChanges(changes) {
    if (changes && (changes.context && changes.context.previousValue !== changes.context.currentValue) ||
      (changes.map && changes.map.previousValue !== changes.map.currentValue)) {
      this.resolveContext();
    }
  }

}
