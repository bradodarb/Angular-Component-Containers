
import { Component, Directive, Input, ViewContainerRef, OnChanges, ComponentRef } from '@angular/core';
import { ComponentInjectorService } from '../services/component-injector.service';
import { ComponentMapService } from '../services/component-map.service';
import { ComponentMap } from '../lib/component-map';
import { BaseResolver, Resolver } from '../lib/resolver-strategy';

@Directive({ selector: '[container-item]' })
export class ContainerItemDirective implements OnChanges {


  @Input() context: Component;

  @Input() map: ComponentMap = new ComponentMap();

  @Input() mapKey: any;

  @Input() resolver: Resolver;

  private injector: ComponentInjectorService;
  private host: ViewContainerRef;
  private current: ComponentRef<any>;
  private maps: ComponentMapService;


  constructor(
    injector: ComponentInjectorService,
    maps: ComponentMapService,
    host: ViewContainerRef) {

    this.injector = injector;
    this.maps = maps;
    this.host = host;
    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }
  }


  private resolveContext(): void {
    if (!!this.context) {

      this.destroyContext();

      this.resolver.resolve(this.context).then(component => {
        if (!!component) {
          this.current = this.injector.injectInto(component, this.host);
          this.current.instance.context = this.context;
        }
      });

    }
  }

  private destroyContext(): void {
    if (this.current) {
      this.current.destroy();
    }
  }

  ngOnChanges(changes): void {
    const dirtyContext = changes.context && changes.context.previousValue !== changes.context.currentValue;
    const dirtyMap = changes.map && changes.map.previousValue !== changes.map.currentValue;
    const dirtyMapKey = changes.mapKey && changes.mapKey.previousValue !== changes.mapKey.currentValue;
    const dirtyResolver = changes.resolver && changes.resolver.previousValue !== changes.resolver.currentValue;

    if (!!this.maps && dirtyMapKey) {
      const map = this.maps.get(this.mapKey);
      this.resolver.map = map;
    }

    if (dirtyMap) {
      this.resolver.map = this.map;
    }

    if (dirtyContext || dirtyMap || dirtyMapKey || dirtyResolver) {
      this.resolveContext();
    }
  }

  ngOnInit(): void {
    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }
  }
}
