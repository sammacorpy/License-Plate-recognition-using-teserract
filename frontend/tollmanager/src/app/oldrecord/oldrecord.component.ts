import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Vehicle } from '../interfaces/vehicle';

@Component({
  selector: 'app-oldrecord',
  templateUrl: './oldrecord.component.html',
  styleUrls: ['./oldrecord.component.scss']
})
export class OldrecordComponent implements OnInit {
  tollRecords:Observable<any[]>
  constructor(private db: AngularFirestore) {
    this.tollRecords=this.db.collection('Tollrecord', ref=>{
      return ref.orderBy("timestamp",'desc')
    }).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Vehicle;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
   }

  ngOnInit() {
  }

}
