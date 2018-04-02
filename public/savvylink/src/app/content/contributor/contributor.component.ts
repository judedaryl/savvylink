import { ContributorDataService, UserdataService } from './../../services/userdata.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Contributor } from '../../../model/profile';

@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: ['./contributor.component.scss']
})
export class ContributorComponent implements OnInit {
  contributor: Contributor;
  constructor(private route: ActivatedRoute, private cDS: ContributorDataService, private uDS: UserdataService) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.cDS.setData(this.route.snapshot.data.content['result'][0]);
      this.contributor = this.cDS.profile;
    });
  }

  get isUser() {
    return this.cDS._id === this.uDS.id;
  }

}
