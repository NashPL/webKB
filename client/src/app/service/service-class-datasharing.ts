import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';

const key = "id_token";
@Injectable()
export class ServiceClassDatasharing {
  public isUserLoggedIn: BehaviorSubject < boolean > = new BehaviorSubject < boolean > (false);

  private setUserLoggedInStatus(status) {
    this.isUserLoggedIn.next(status);
  }

  public getUserLoggedInToken() {
    let res = localStorage.getItem(key);
    if (res === null) {
      this.setUserLoggedInStatus(false);
    } else {
      this.setUserLoggedInStatus(true);
    }
  }

  public setUserLoggedInToken(token) {
    localStorage.setItem(key, token);
    this.getUserLoggedInToken();
  }

  public removeUserLoggedInToken() {
    localStorage.removeItem(key)
    this.getUserLoggedInToken();
  }
}
