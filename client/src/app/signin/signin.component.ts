import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  Inject
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ServiceClassAuth
} from '../service/service-class-auth';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [ServiceClassAuth]
})
export class SigninComponent implements OnInit {
  username: String;
  password: String;

  ngOnInit() {}

  constructor(
    public dialogRef: MatDialogRef < SigninComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: ServiceClassAuth,
    private router: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  loginSubmit(postValues): void {
    const user = {
      'usr': postValues.value.usrname,
      'psw': postValues.value.psw
    }

    const res = this.authService.login(user).subscribe(res => {
      this.dialogRef.close();
      if (res['success']) {
        this.authService.storeUserData(res['success'].token, res['success'].SESSION);
        this.router.navigate(['dashboard']);
      } else {
        //DO ALERT
      }
    });
  }
}
