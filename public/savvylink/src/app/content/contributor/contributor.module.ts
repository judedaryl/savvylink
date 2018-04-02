import { MaterialModule } from './../../material/material.module';
import { RouterModule } from '@angular/router';
import { ContributorDataService } from './../../services/userdata.service';
import { ContactListContributorComponent } from './contact-list-contributor/contact-list-contributor.component';
import { OrganizationListContributorComponent } from './organization-list-contributor/organization-list-contributor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributorComponent } from './contributor.component';
import { UserNameResolve } from '../../resolve/userdata.resolve';
import { OrganizationSingleContributorComponent } from './organization-single-contributor/organization-single-contributor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    OrganizationListContributorComponent,
    ContactListContributorComponent,
    ContributorComponent,
    OrganizationSingleContributorComponent
  ],
  providers: [
    ContributorDataService
  ]
})
export class ContributorModule { }
