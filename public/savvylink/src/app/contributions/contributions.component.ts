import { Component, OnInit } from '@angular/core';
import { CurrentUser } from '../models/currentuser';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css']
})
export class ContributionsComponent implements OnInit {
  user = CurrentUser;
  constructor() { 
  }

  ngOnInit() {
  }

}
