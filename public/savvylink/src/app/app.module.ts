import { HitResolve } from './main-page/hit.resolve';
import { ContactsResolve } from './contacts-user/contact.resolve';
import { OrganizationDetailResolve } from './organization/organization.resolve';
import { RegisterComponent } from './register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SemanticService } from './semantic.service';
import { AgmCoreModule } from '@agm/core';
import { OrganizationformComponent } from './organizationform/organizationform.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RoutingModule } from './routing/routing.module';
import { LoginAddonComponent } from './login-addon/login-addon.component';
import { SocialComponent } from './social/social.component';
import { LoginComponent } from './login/login.component';
import { setHttpClient } from './app.injector';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { UsersService } from './users.service';
import { ContributionsComponent } from './contributions/contributions.component';
import { ContributionsUserComponent } from './contributions-user/contributions-user.component';
import { FormService } from './models/form.service';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationComponent } from './organization/organization.component';
import { ArraySortPipe } from './array-sort.pipe';
import { ContactformComponent } from './contactform/contactform.component';
import { OrganizationspageComponent } from './organizationspage/organizationspage.component';
import { OrganizationsUserComponent } from './organizations-user/organizations-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrganizationService } from './organization.service';
import { ProfileService } from './profile.service';
import { MainPageComponent } from './main-page/main-page.component';
import { OrganizationUserResolve } from './organizations-user/organizations-user.resolve';
import { OrganizationsResolve } from './organizations/organizations.resolve';
import { AuthguardService } from './authguard.service';
import { OrganizationUserComponent } from './organization-user/organization-user.component';
import { ContactsUserComponent } from './contacts-user/contacts-user.component';
import { OrganizationUserDetailComponent } from './organization-user-detail/organization-user-detail.component';
import { ContactService } from './contact.service';
import { UserContributionResolve } from './contributions-user/contributions-user.resolve';
import { ContactsUserPageComponent } from './contacts-user-page/contacts-user-page.component';
import { ContactsUserPageResolve } from './contacts-user-page/contacts-user-page-resolve';
import { ContactformUserComponent } from './contactform-user/contactform-user.component';
import { HomeGuardService } from './home-guard.service';
import { DataTablesModule } from 'angular-datatables';
import { FooterComponent } from './footer/footer.component';
import { PrintService } from './print.service';
import { ContactsComponent } from './contacts/contacts.component';
@NgModule({
  declarations: [
    AppComponent,
    OrganizationformComponent,
    HeaderComponent,
    HomepageComponent,
    LoginAddonComponent,
    LoginComponent,
    RegisterComponent,
    SocialComponent,
    ContributionsComponent,
    ContributionsUserComponent,
    OrganizationsComponent,
    OrganizationComponent,
    ArraySortPipe,
    ContactformComponent,
    OrganizationspageComponent,
    OrganizationsUserComponent,
    MainPageComponent,
    OrganizationUserComponent,
    ContactsUserComponent,
    OrganizationUserDetailComponent,
    ContactsUserPageComponent,
    ContactformUserComponent,
    FooterComponent,
    ContactsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
    DataTablesModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
    SemanticService,
    AuthService,
    UsersService,
    FormService,
    OrganizationService,
    OrganizationDetailResolve,
    OrganizationUserResolve,
    OrganizationsResolve,
    ContactsResolve,
    UserContributionResolve,
    ContactsUserPageResolve,
    HitResolve,
    ProfileService,
    AuthguardService,
    ContactService,
    HomeGuardService,
    PrintService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(hc: HttpClient) {
    setHttpClient(hc);
  }
}
