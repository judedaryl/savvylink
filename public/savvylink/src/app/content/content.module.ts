import { PrintService } from './../services/print.service';
import { ContributorModule } from './contributor/contributor.module';
import { OrganizationdataService } from './../services/organizationdata.service';
import { OrganizationGlobalResolve } from './../resolve/organization.resolve';
import { OrganizationDao } from './../../dao/organization';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentRoutingModule } from './content-routing.module';
import { HomeComponent } from './home/home.component';
import { OrganizationListComponent } from './global/organization-list/organization-list.component';
import { ContactListComponent } from './global/contact-list/contact-list.component';
import { MatIconModule } from '@angular/material';
import { ContactDao } from './../../dao/contact';
import { ContentComponent } from './content.component';
import { OrganizationSingleComponent } from './global/organization-single/organization-single.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ContentRoutingModule,
    MaterialModule,
    MatIconModule,
    ContributorModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HomeComponent,
    OrganizationListComponent,
    ContactListComponent,
    ContentComponent,
    OrganizationSingleComponent,
  ],
  providers: [
    OrganizationdataService,
    PrintService,
    OrganizationDao,
    ContactDao
  ]
})
export class ContentModule { }
