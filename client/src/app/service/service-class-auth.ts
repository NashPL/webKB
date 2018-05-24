import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Response
} from '@angular/http';
import {
  ServiceClassDatasharing
} from './service-class-datasharing';
import 'rxjs/add/operator/map';

@Injectable()
export class ServiceClassAuth {
  authToken: any;
  user: any;
  headers = new HttpHeaders();
  constructor(private http: HttpClient, private datasharing: ServiceClassDatasharing) {}

  signinUser(user) {}

  login(user) {
    this.headers.append('Content-Type', 'application/json');
    const loginUrl = 'http://localhost:3000/login';
    return this.http.post(loginUrl, user, {
      headers: this.headers
    }).map((res: Response) => res);
  }

  storeUserData(token, user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.datasharing.setUserLoggedInToken(token);
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.headers.append('Content-Type', 'application/json');
    const logoutUrl = 'http://localhost:3000/logout';
    const postData = {
      logout: true,
      sessionId: localStorage.getItem('id_token')
    }
    return this.http.post(logoutUrl, postData, {
      headers: this.headers
    }).map((res: Response) => res);
  }

}
