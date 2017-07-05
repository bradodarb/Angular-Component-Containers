import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentInjectorService } from './services/component-injector.service';
import { ContainerItemDirective } from './directives/container-item.directive';
import { ContainerListDirective } from './directives/container-list.directive';
import { ComponentMap, ComponentMapItem } from './lib/component-map';

export { ComponentMap };
export { ComponentMapItem };

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ContainerItemDirective,
    ContainerListDirective],
  exports: [
    ContainerItemDirective,
    ContainerListDirective
  ],
  providers: [ComponentInjectorService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentContainerModule {
  static defaultMap(map) {
    ComponentInjectorService.map.init(map);
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentContainerModule,
      providers: [ComponentInjectorService]
    };
  }
}