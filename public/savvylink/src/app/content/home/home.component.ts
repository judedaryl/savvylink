import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ContactDao } from './../../../dao/contact';
import { UserDao } from './../../../dao/user';
import { Component, OnInit } from '@angular/core';
import { OrganizationDao } from '../../../dao/organization';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hits = 0;
  orgcount = 0;
  concount = 0;
  constructor(private userDao: UserDao, private orgDao: OrganizationDao,
    private route: ActivatedRoute, private conDao: ContactDao) { }

  ngOnInit() {
    const stat = this.route.snapshot.data.statistic;
    this.hits = stat[0]['results']['count'];
    this.concount = stat[1]['result'][0]['count'];
    this.orgcount = stat[2]['result'][0]['count'];
  }

}
