import {
  Input,
  Directive,
  ChangeDetectorRef,
  DoCheck,
  IterableDiffer,
  IterableDiffers,
  Component,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { ComponentInjectorService } from '../services/component-injector.service';
import { ComponentMap } from '../lib/component-map';
import { BaseResolver, Resolver } from '../lib/resolver-strategy';

@Directive({ selector: '[container-list]' })
export class ContainerListDirective {


  @Input() collection: any;

  @Input() map: ComponentMap = new ComponentMap();

  @Input() resolver: Resolver;

  private injector: ComponentInjectorService;

  private host: ViewContainerRef;


  private collectionMap: Map<any, ComponentRef<any>>;
  private changeDetector: ChangeDetectorRef;
  private differs: IterableDiffers;
  private differ: IterableDiffer;

  constructor(injector: ComponentInjectorService,
    host: ViewContainerRef,
    changeDetector: ChangeDetectorRef,
    differs: IterableDiffers) {
    this.differs = differs;

    this.injector = injector;
    this.host = host;

    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }

    this.collectionMap = new Map<any, ComponentRef<any>>();
  }

  private resolveContext(context, index: number = 0): void {

    this.resolver.resolve(context).then(component => {
      if (!!component) {
        const current = this.injector.injectInto(component, this.host, index);
        current.instance.context = context;
        this.collectionMap.set(context, current);
      }
    });

  }

  private resolveCollection(): void {
    if (this.collection) {
      this.destroyCollection();
      this.collection.forEach((component, index) => {
        this.resolveContext(component, index);
      });
    }
  }

  private destroyCollection(): void {
    if (this.collectionMap) {
      this.collectionMap.forEach(element => {
        element.destroy();
      });
      this.collectionMap.clear();
    }
  }

  ngOnChanges(changes): void {
    const dirtyCollection = changes.collection && changes.collection.previousValue !== changes.collection.currentValue;
    const dirtyMap = changes.map && changes.map.previousValue !== changes.map.currentValue;
    const dirtyResolver = changes.resolver && changes.resolver.previousValue !== changes.resolver.currentValue;

    if (dirtyMap) {
      this.resolver.map = this.map;
    }

    if (dirtyCollection) {
      if (this.collection && !this.differ) {
        this.differ = this.differs.find(this.collection).create(this.changeDetector);
      }
    }

    if (dirtyCollection || dirtyMap || dirtyResolver) {
      this.resolveCollection();
    }

  }

  ngDoCheck(): void {

    if (this.differ) {
      const changes = this.differ.diff(this.collection);
      if (changes) {
        changes.forEachAddedItem((change) => {
          if (!this.collectionMap.has(change.item)) {
            this.resolveContext(change.item, change.index);
          }
        });
        changes.forEachRemovedItem((change) => {
          const toRemove = this.collectionMap.get(change.item);
          if (toRemove) {
            this.collectionMap.delete(change.item);
            toRemove.destroy();
          }
        });
      }
    }
  }

  ngOnInit(): void {
    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }
  }

}
