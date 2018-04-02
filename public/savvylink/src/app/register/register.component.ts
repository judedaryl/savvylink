import { Observable } from 'rxjs/Observable';
import { GenericErrorResponse } from './../../model/genericerror';
import { UserDao } from './../../dao/user';
import { AuthenticationService } from './../services/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  error: GenericErrorResponse;
  isSending = false;
  ngOnInit() {
    console.log(this.auth.isAuthenticated);
    this.error = new GenericErrorResponse();
    this.error.state = false;
    this.error.mess = '';
    this.registrationForm.valueChanges.subscribe(val => {
      this.error.state = false;
    });
  }
  constructor(private builder: FormBuilder, public router: Router,
    private auth: AuthenticationService, private userDao: UserDao) {
    this.generateForm();
  }

  generateForm() {
    this.registrationForm = this.builder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', [Validators.minLength(5), Validators.required]],
    });
  }

  async onSubmit() {
    this.isSending = true;
    $('.ui.form').addClass('loading');
    this.userDao.register(this.registrationForm.value).subscribe(
      val => {
        this.isSending = false;
        this.userDao.login(this.userDao.login(this.registrationForm)).subscribe(val_ => {
          this.auth.login(val_);
          $('.ui.form').removeClass('loading');
        });
      },
      err => {
        this.isSending = false;
        $('.ui.form').removeClass('loading');
        const error = err.error;
        this.error.state = true;
        this.error.mess = error.error;
      }
    );
  }

  get disablebutton() { return this.registrationForm.valid && !this.isSending; }
}


