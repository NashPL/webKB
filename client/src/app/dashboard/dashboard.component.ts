import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';

import {
  ServiceClassDatasharing
} from '../service/service-class-datasharing';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dataSharingService: ServiceClassDatasharing, private router: Router) {
    const token = this.dataSharingService.getUserLoggedInToken();


  }

  ngOnInit() {}

}
