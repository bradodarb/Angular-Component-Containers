
import { Component } from '@angular/core';
import { ComponentMap } from './component-map';
import { ComponentInjectorService } from '../services/component-injector.service';
export class BaseResolver implements Resolver {

    public map: ComponentMap


    constructor(map: ComponentMap) {
        this.map = map;
    }
    resolve(obj) {
        if (obj) {
            let component = null;
            const targetType = this.getKey(obj);

            if (this.map) {
                component = this.map.getComponent(targetType);
            }

            if (!component) {
                if (ComponentInjectorService.map) {
                    component = ComponentInjectorService.map.getComponent(targetType);
                }
            }

            return Promise.resolve(component);
        }
    }
    getKey(obj: any) {
        return Object.getPrototypeOf(obj).constructor;
    }
}

export class PropertyResolver extends BaseResolver {

    private key: string;
    constructor(map: ComponentMap, key: string) {
        super(map);
        this.key = key;
    }
    getKey(obj: any) {
        return obj[this.key];
    }
}

export interface Resolver {
    map: ComponentMap
    resolve(obj: any): Promise<Component>
    getKey(obj: any): any
}