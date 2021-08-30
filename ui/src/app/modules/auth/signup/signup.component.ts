import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@fboservices/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ '../common/login-register.scss' ]
})
export class SignupComponent {

  error: string | null;

  loading = false;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    cPassword: new FormControl('', [ Validators.required ]),
  });

  constructor(private readonly userService:UserService,
    private readonly router:Router) {}

  submit():void {

    this.error = null;
    if (this.form.valid === true) {

      this.loading = true;
      this.userService.signUp(this.form.value).subscribe((message) => {

        this.loading = false;
        this.router.navigateByUrl('/');

      }, (error) => {

        this.loading = false;
        this.error = error.error.message;
        if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

          this.error = 'Please provide a valid email.';


        }
        if (this.form.value.password !== this.form.value.cPassword) {

          this.error = 'Password and confirm password should be same.';


        }

      });


    }

  }

}
