import { TestComponent } from './../test/test.component';
import { RouterModule } from '@angular/router';
import { OrganizationGlobalResolve } from './../resolve/organization.resolve';
import { UserDataResolve, UserNameResolve } from './../resolve/userdata.resolve';
import { ContentModule } from './../content/content.module';
import { RegistrationGuard } from './../guards/registration.guard';
import { MaterialModule } from './../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationGuard } from './../guards/authentication.guard';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { RegisterComponent } from '../register/register.component';
import { UserDao } from '../../dao/user';
import { UserdataService } from '../services/userdata.service';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ContentModule,
  ],
  declarations: [MainComponent, FooterComponent, HeaderComponent, RegisterComponent, TestComponent],
  providers: [
    OrganizationGlobalResolve,
    UserDataResolve,
    UserNameResolve,
    UserdataService,
    AuthenticationGuard,
    RegistrationGuard,
    UserDao
  ]
})
export class MainModule {}
