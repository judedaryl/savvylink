import { ContactsComponent } from './../contacts/contacts.component';
import { HitResolve } from './../main-page/hit.resolve';
import { Contact } from './../contactform/models/contact';
import { ContactsUserComponent } from './../contacts-user/contacts-user.component';
import { OrganizationUserComponent } from './../organization-user/organization-user.component';
import { AuthguardService as AuthGuard } from './../authguard.service';
import { UserDataResolve } from './../userdata.resolve';
import { OrganizationDetailResolve } from './../organization/organization.resolve';
import { OrganizationsUserComponent } from './../organizations-user/organizations-user.component';
import { OrganizationsComponent } from './../organizations/organizations.component';
import { ContributionsComponent } from './../contributions/contributions.component';
import { ContributionsUserComponent } from './../contributions-user/contributions-user.component';
import { LoginComponent } from './../login/login.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { HomepageComponent } from '../homepage/homepage.component';
import { RouterModule } from '@angular/router/';
import { RegisterComponent } from '../register/register.component';
import { SocialComponent } from '../social/social.component';
import { OrganizationComponent } from '../organization/organization.component';
import { OrganizationspageComponent } from './../organizationspage/organizationspage.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { OrganizationUserResolve } from '../organizations-user/organizations-user.resolve';
import { OrganizationsResolve } from '../organizations/organizations.resolve';
import { OrganizationUserDetailComponent } from '../organization-user-detail/organization-user-detail.component';
import { ContactsResolve } from '../contacts-user/contact.resolve';
import { UserContributionResolve } from '../contributions-user/contributions-user.resolve';
import { ContactsUserPageResolve } from '../contacts-user-page/contacts-user-page-resolve';
import { ContactsUserPageComponent } from '../contacts-user-page/contacts-user-page.component';
import { HomeGuardService } from '../home-guard.service';
const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    resolve: { content: UserDataResolve, hit: HitResolve },
    children: [
      { path: '', component: HomepageComponent , canActivate: [HomeGuardService]},
      { path: 'register', component: RegisterComponent },
      {
        path: 'organizations',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: OrganizationsComponent,
          },
          {
            path: ':orgid',
            component: OrganizationComponent,
            resolve: { content: OrganizationDetailResolve }
          },
        ]
      },
      {
        path: 'contacts',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: ContactsComponent
          }
        ]
      },
      {
        path: 'contributions',
        canActivate: [AuthGuard],
        children: [
          {
            path: '', redirectTo: '/', pathMatch: 'full',
          },
          {

            path: ':username',
            component: ContributionsUserComponent,
            resolve: { thisuser: UserContributionResolve },
            children: [
              {
                path: '', redirectTo: 'organizations', pathMatch: 'full',
              },
              {
                path: 'contacts',
                component: ContactsUserPageComponent,
                resolve: { content: ContactsUserPageResolve, organizations: OrganizationUserResolve },
              },
              {
                path: 'organizations',
                component: OrganizationsUserComponent,
                resolve: { content: OrganizationUserResolve },
              },
              {
                path: 'organizations/:orgid',
                component: OrganizationUserComponent,
                resolve: { content: OrganizationDetailResolve, contacts: ContactsResolve },
                children: [
                  {
                    path: 'details',
                    component: OrganizationUserDetailComponent,
                    // resolve: { content: OrganizationDetailResolve }
                  },
                  {
                    path: 'contacts',
                    component: ContactsUserComponent,
                    // resolve: { content: OrganizationDetailResolve }
                  }
                ]
              }
            ]
          },
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'login/:status', component: LoginComponent },
  { path: 'social/callback/:social/:token', component: SocialComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full', }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [UserDataResolve]
})
export class RoutingModule { }
