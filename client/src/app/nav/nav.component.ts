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
  ServiceClassDatasharing
} from '../service/service-class-datasharing';
import {
  ServiceClassAuth
} from '../service/service-class-auth';
import {
  SigninComponent
} from './../signin/signin.component';
import {
  Router
} from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  id_token: Boolean;
  username: String;

  constructor(public dialog: MatDialog, private dataSharingService: ServiceClassDatasharing,
    private authService: ServiceClassAuth, private router: Router) {
    this.dataSharingService.getUserLoggedInToken();
    this.dataSharingService.isUserLoggedIn.subscribe(res => {
      this.id_token = res;
      if (this.id_token && this.id_token !== undefined) {
        const user = JSON.parse(localStorage.getItem('user'));
        this.username = user['user'].user_username;
      }
    });

  }

  ngOnInit() {}

  openDialog(): void {
    let dialogRef = this.dialog.open(SigninComponent, {
      width: '450px',
      data: {}
    });
  }

  public logout() {
    this.authService.logout().subscribe(res => {
      if (res['success']) {
        localStorage.clear();
        this.dataSharingService.removeUserLoggedInToken();
      }
    });
    this.router.navigate(['']);
  }

}
