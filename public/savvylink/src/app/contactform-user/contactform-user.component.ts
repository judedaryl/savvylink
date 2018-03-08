import { FormService } from './../models/form.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactform-user',
  templateUrl: './contactform-user.component.html',
  styleUrls: ['./contactform-user.component.css']
})
export class ContactformUserComponent implements OnInit {

  contact = this.form.contactform;
  orglist = this.form.user_orglist;
  constructor(private form: FormService) {
  }

  ngOnInit() {
  }

}
