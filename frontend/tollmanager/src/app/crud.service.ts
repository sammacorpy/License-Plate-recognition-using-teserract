import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Vehicle } from './interfaces/vehicle';
@Injectable({
  providedIn: 'root'
})
export class CrudService {


  task: AngularFireUploadTask;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, ) { }

  post(collection: string, data: any) {
    return this.db.collection(collection).add(data);
  }

  get(location) {
    return this.db.doc<any>(location).valueChanges();
  }

  getcollection(location) {
    return this.db.collection<any>(location).valueChanges();
  }

  delete(location) {
    return this.db.doc<any>(location).delete();
  }

  // deletecollection(location){
  //   return this.db.collection(location);
  // }

  update(location: string, data: any) {
    return this.db.doc<any>(location).update(data);
  }


  postfile(location, file: File) {
    const path = location;
    return this.storage.upload(path, file);

  }

  deletefile(location, filename) {
    return this.storage.ref(location + "/" + filename).delete();
  }
  getfile(location) {
    return this.storage.ref(location).getDownloadURL().toPromise();

  }


  get top5record():Observable<any>{
   return this.db.collection('Tollrecord', res=>{
      return res.orderBy('timestamp',"desc").limit(5);
    }).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Vehicle;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }


}
