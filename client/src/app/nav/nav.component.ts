import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { SigninComponent } from './../signin/signin.component';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }
  openDialog(): void {
    let dialogRef = this.dialog.open(SigninComponent, {
      width: '250px',
      data: {}
    });
  }

}
