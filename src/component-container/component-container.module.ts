import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentInjectorService } from './services/component-injector.service';
import { ContainerItemDirective } from './directives/container-item.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ContainerItemDirective],
  exports: [
    ContainerItemDirective
  ],
  providers: [ComponentInjectorService]
})
export class ComponentContainerModule {
  static defaultMap(map) {
    ComponentInjectorService.map.init(map);
  }
}
