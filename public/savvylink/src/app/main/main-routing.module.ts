import { TestComponent } from './../test/test.component';
import { OrganizationSingleContributorComponent } from './../content/contributor/organization-single-contributor/organization-single-contributor.component';
import { UserNameResolve } from './../resolve/userdata.resolve';
import { OrganizationListContributorComponent } from './../content/contributor/organization-list-contributor/organization-list-contributor.component';
import { ContactListContributorComponent } from './../content/contributor/contact-list-contributor/contact-list-contributor.component';
import { ContributorComponent } from './../content/contributor/contributor.component';
import { OrganizationGlobalResolve } from './../resolve/organization.resolve';
import { OrganizationSingleComponent } from './../content/global/organization-single/organization-single.component';
import { RegisterComponent } from './../register/register.component';
import { AuthenticationGuard } from './../guards/authentication.guard';
import { HomeComponent } from './../content/home/home.component';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationGuard } from '../guards/registration.guard';
import { OrganizationListComponent } from '../content/global/organization-list/organization-list.component';
import { ContactListComponent } from '../content/global/contact-list/contact-list.component';
import { ContentComponent } from '../content/content.component';
import { UserDataResolve } from '../resolve/userdata.resolve';

const routes: Routes = [
  { path: 'test', component: TestComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthenticationGuard],
    resolve: { content: UserDataResolve },
    children: [
      {
        path: '',
        component: ContentComponent,
        canActivate: [AuthenticationGuard],
        children: [
          { path: '', redirectTo: 'organization-list', pathMatch: 'full' },
          { path: 'organization-list', component: OrganizationListComponent },
          { path: 'contact-list', component: ContactListComponent },
          {
            path: 'organization',
            children: [
              { path: '', redirectTo: '/organization-list', pathMatch: 'full' },
              { path: ':org_id', component: OrganizationSingleComponent, resolve: { content: OrganizationGlobalResolve } }
            ]
          },
          {
            path: 'contributions',
            children: [
              { path: '', redirectTo: '/', pathMatch: 'full' },
              {
                path: ':username',
                resolve: { content: UserNameResolve },
                component: ContributorComponent,
                runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                children: [
                  { path: '', redirectTo: 'organization-list', pathMatch: 'full' },
                  { path: 'organization-list', component: OrganizationListContributorComponent },
                  { path: 'contact-list', component: ContactListContributorComponent },
                  {
                    path: 'organization',
                    children: [
                      {
                        path: ':org_id', component: OrganizationSingleContributorComponent,
                        resolve: { content: OrganizationGlobalResolve },
                        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                      }
                    ]
                  }
                ]
              },
            ]
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
