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
import { ComponentMapService } from '../services/component-map.service';
import { ComponentMap } from '../lib/component-map';
import { BaseResolver, Resolver } from '../lib/resolver-strategy';

@Directive({ selector: '[container-list]' })
export class ContainerListDirective {


  @Input() collection: any;

  @Input() map: ComponentMap = new ComponentMap();

  @Input() mapKey: any;

  @Input() resolver: Resolver;

  private injector: ComponentInjectorService;

  private host: ViewContainerRef;

  private maps: ComponentMapService;


  private collectionMap: Map<any, ComponentRef<any>>;
  private changeDetector: ChangeDetectorRef;
  private differs: IterableDiffers;
  private differ: IterableDiffer;

  constructor(
    injector: ComponentInjectorService,
    maps: ComponentMapService,
    host: ViewContainerRef,
    changeDetector: ChangeDetectorRef,
    differs: IterableDiffers) {

    this.differs = differs;
    this.maps = maps;
    this.injector = injector;
    this.host = host;

    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }

    this.collectionMap = new Map<any, ComponentRef<any>>();
  }

  private resolveContext(context, index?: number) {

    return this.resolver.resolve(context).then(component => {
      if (!!component) {
        if (!this.collectionMap.has(context)) {
          const current = this.injector.injectInto(component, this.host, index);
          current.instance.context = context;
          this.collectionMap.set(context, current);
        }
      }
      Promise.resolve(this.collectionMap.size);
    });

  }

  private resolveCollection() {
    const _self = this;
    if (this.collection) {
      this.destroyCollection().then(() => {
        const toResolve = [];
        this.collection.forEach((component, index) => {
          toResolve.push(_self.resolveContext(component, index));
        });
        return Promise.all(toResolve);
      });
    }
  }

  private destroyCollection() {
    return new Promise((resolve, reject) => {
      const size = this.collectionMap.size;
      if (this.collectionMap) {
        this.collectionMap.forEach(element => {
          element.destroy();
        });
        this.collectionMap.clear();
      }
      resolve(size);
    });
  }

  ngOnChanges(changes): void {
    const dirtyCollection = changes.collection && changes.collection.previousValue !== changes.collection.currentValue;
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

    if (dirtyCollection) {
      if (this.collection && !this.differ) {
        this.differ = this.differs.find(this.collection).create(this.changeDetector);
      }
    }

    if (dirtyCollection || dirtyMap || dirtyMapKey || dirtyResolver) {
      this.resolveCollection();
    }

  }

  ngDoCheck(): void {
    if (this.differ) {
      const changes = this.differ.diff(this.collection);
      if (changes && changes.isDirty) {
        this.resolveCollection();
      }

    }
    //TODO: Track and update changes rather than just recreating every time...    
    // if (this.differ) {
    //   const changes = this.differ.diff(this.collection);
    //   if (changes) {
    //     changes.forEachAddedItem((change) => {
    //       if (!this.collectionMap.has(change.item)) {
    //         this.resolveContext(change.item);
    //       }
    //     });
    //     changes.forEachRemovedItem((change) => {
    //       const toRemove = this.collectionMap.get(change.item);
    //       if (toRemove) {
    //         this.collectionMap.delete(change.item);
    //         toRemove.destroy();
    //       }
    //     });
    //   }
    // }
  }

  ngOnInit(): void {
    if (!this.resolver) {
      this.resolver = new BaseResolver(this.map);
    }
  }

}
