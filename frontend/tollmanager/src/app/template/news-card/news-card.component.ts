import { Component, OnInit, Input, Output ,EventEmitter, OnDestroy} from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';
import { Vehicle } from 'src/app/interfaces/vehicle';
// import { url } from 'inspector';

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent implements OnInit, OnDestroy {

  @Input('toll') toll: Vehicle;
  @Input('mode') mode;
  shared:boolean=false;
  user: User;


  subs:Subscription;


  constructor(private auth: AuthService) {
    this.subs=this.auth.user$.subscribe(u=>this.user=u);
   }

  ngOnInit() {
  }


  ngOnDestroy(){
    this.subs.unsubscribe();
  }


}
