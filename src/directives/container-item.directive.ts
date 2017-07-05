
import { Component, Directive, Input, ViewContainerRef, OnChanges, ComponentRef, OnInit } from '@angular/core';
import { ComponentInjectorService } from '../services/component-injector.service';
import { ComponentMap } from '../lib/component-map';
import { BaseResolver, Resolver } from '../lib/resolver-strategy';

@Directive({ selector: '[container-item]' })
export class ContainerItemDirective implements OnChanges, OnInit {


  @Input() context: Component;

  @Input() map: ComponentMap = new ComponentMap();

  @Input() resolver: Resolver

  private injector: ComponentInjectorService;
  private host: ViewContainerRef;
  private current: ComponentRef<any>;

  constructor(injector: ComponentInjectorService, host: ViewContainerRef) {
    this.injector = injector;
    this.host = host;
  }

  ngOnInit() {
    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }
  }

  private resolveContext() {
    this.destroyContext();

    this.resolver.resolve(this.context).then(component => {
      if (!!component) {
        this.current = this.injector.injectInto(component, this.host);
        this.current.instance.context = this.context;
      }
    });

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
