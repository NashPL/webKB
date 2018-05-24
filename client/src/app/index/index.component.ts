import {
  Component,
  OnInit
} from '@angular/core';
import {
  ServiceClassDatasharing
} from '../service/service-class-datasharing';

import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  constructor(private dataSharingService: ServiceClassDatasharing, private router: Router) {
    const token = this.dataSharingService.getUserLoggedInToken();
  }

  ngOnInit() {}

}
