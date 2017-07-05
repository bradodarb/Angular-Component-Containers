# Component Containers

This is a template for building your own reusable Angular2/Ionic2 module using TypeScript. Supports Angular's ngc and Ahead-of-Time compiling out of the box.

## Using Component Containers

### Import ComponentContainerModule and register injectable components
```typescript
import { NgModule } from '@angular/core';
import { MyApp } from './app.component';

// Import Component Containers
import { ComponentContainerModule } from 'component-containers';

// Import any static components that you'll want to inject and add them to this module's entryComponents[] (dynamic components register themselves)

import { AdminUserComponent } from './components/admin-user.component';
import { MemberUserComponent } from './components/member-user.component';
import { NewUserComponent } from './components/new-user.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [ 
    ComponentContainerModule // Expose Component Containers to your app
  ],
  bootstrap: [AppModule],
  entryComponents: [
    AdminUserComponent,
    MemberUserComponent,
    NewUserComponent
  ],
  providers: []
})
export class AppModule {}
```


### Create a map to link your models to components


```typescript
import { Component } from '@angular/core';

import { AdminUserComponent } from './admin-user.component';
import { MemberUserComponent } from './member-user.component';
import { NewUserComponent } from './new-user.component';

import { ComponentMap, ContainerItemDirective } from 'component-containers';

@Component({
  selector: 'app-user-editor',
  template: '<ng-container container-item [map]="map" [context]="current"></ng-container>',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent {

  public current: any;
  public map: ComponentMap;

  constructor() {
    this.map =
      new ComponentMap([{
        model: AdminUser,
        component: AdminUserComponent
      }, {
        model: MemberUser,
        component: MemberUserComponent
      }, {
        model: NewUser,
        component: NewUserComponent
      }])
  }

  editUser(user) {
    //This will automatically resolve the proper editor component based on the user's type
    this.current = user;
  }

}
class AdminUser extends MemberUser{
  roles:Array<string>;
}
class MemberUser extends Base {
  name:string
  email:string
  profilePic:string
}
class NewUser {
  name:string
  signupType:string
}


```




## Developing

Develop this module like any other Angular 2 module. Then, run `npm run build` to build a local copy.



## npm link

Currently, this module must be published to npm. `npm link` packages will not install properly.
