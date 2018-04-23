import { UserdataService } from './../../services/userdata.service';
import { ActivatedRoute } from '@angular/router';
import { UserDao } from './../../../dao/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  hits = 0;
  constructor(private userDao: UserDao, private uDS: UserdataService) { }

  ngOnInit() {
    this.userDao.hits().subscribe(
      val => { this.hits = val['results']['count']; this.uDS.hits = this.hits; }
    );
  }

}
