import { GenericErrorResponse } from './../../model/genericerror';
import { UserDao } from './../../dao/user';
import { AuthenticationService } from './../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';


declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: GenericErrorResponse = new GenericErrorResponse();
  returnURL: string;
  isSending = false;
  ngOnInit() {
    this.error.state = false;
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/';
    this.loginForm.valueChanges.subscribe(() => this.error.state = false);
  }


  constructor(public auth: AuthenticationService, private builder: FormBuilder, private router: Router, private route: ActivatedRoute,
    private userDao: UserDao) {
    this.route.params.subscribe(params => {
      if (params['status']) {

      }
    });
    this.generateForm();
  }

  generateForm() {
    this.loginForm = this.builder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    this.isSending = true;
    this.userDao.login(this.loginForm.value).subscribe(
      resp => {
        this.isSending = false;
        this.error.state = false;
        this.auth.login(resp);
      },
      err => {
        this.isSending = false;
        this.error.state = true;
        this.error.mess = err.error.data;
        console.log(err);
      }
    );
  }


  observeResponse(obs) {
    obs.subscribe(
      data => {
        this.handleResponse(data);
      },
      err => {
        if (err.status === 400) {
          this.handleResponse(err.error);
        }
      }
    );
  }

  handleResponse(param) {
    $('.ui.form').removeClass('loading');

  }

  get livedata() { return JSON.stringify(this.loginForm.value); }

}
