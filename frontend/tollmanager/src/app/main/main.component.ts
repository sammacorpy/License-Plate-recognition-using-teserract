import { Component, OnInit, HostListener } from '@angular/core';
import { TakesnapshotService } from '../takesnapshot.service';

import 'rxjs/add/operator/take';
import { Observable, Observer } from 'rxjs';
import { News } from '../interfaces/news';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { CrudService } from '../crud.service';
import { RequestOptions, Headers, Http } from '@angular/http';
import * as firebase from 'firebase';
import { Vehicle } from '../interfaces/vehicle';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

  // allnews=['a','b','c','a','b','c','a','b','c']
  sharetriggered: boolean = false;
  sharedata = null;
  checkpointdate: Date;
  tollRecords: Observable<Vehicle[]>;
  manual = false;



  dropactive: boolean;
  selectedFiles: FileList;

  imageuploadpreUrl: any;

  base64TrimmedURL: any;
  base64DefaultURL: any;
  generatedImage: any;
  imageFile: File;

  vehicledata: Vehicle = {} as Vehicle;

  // @HostListener(scroll)
  constructor(private __: TakesnapshotService, private crud: CrudService, private req: Http) {
    __.takesnap();

    this.tollRecords = this.crud.top5record;
    // this.allnews=this.ns.latestnews;

  }

  // ngOnInit() {
  // }


  onScroll() {



  }

  trackrecord(index, tollitem) {
    return tollitem ? tollitem.id : undefined;

  }












  public showWebcam = true;

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    // WebcamUtil.getAvailableVideoInputs()
    //   .then((mediaDevices: MediaDeviceInfo[]) => {
    //     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    //   });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }



  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    const block = webcamImage.imageAsDataUrl.split(';');
    const contentType = block[0].split(":")[1];
    const img = block[1].split(",")[1];

    const imgfile: any = this.b64toBlob(img, contentType);
    imgfile.lastModified = new Date();
    const time = firebase.firestore.FieldValue.serverTimestamp();
    this.crud.post('vehicle', { timestamp: time }).then(res => {


      // return;
      imgfile.name = res.id;
      // console.log(webcamImage.imageAsDataUrl.slice(23))
      // this.getImage(webcamImage.imageAsDataUrl.slice(23));
      const filename = res.id;
      this.crud.postfile("/vehicle/" + filename, imgfile).then(ress => {
        ress.ref.getDownloadURL().then(u => {
          this.vehicledata.photoURL = u;
          // this.newsdata.imageURL=;
          this.crud.update('vehicle/' + res.id, this.vehicledata).then(() => {
            //   this.uiblock = false;
            this.sendbackendtowork(this.vehicledata.photoURL).then(resss => {
              if (resss) {
                console.log(resss);

              }
            });
          });

        });
      });
    });
  }


  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }













  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 1024;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }






  detectFiles(event) {
    this.selectedFiles = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles.item(0));
    reader.onload = (_event) => {
      this.imageuploadpreUrl = reader.result;
    }

    const time = firebase.firestore.FieldValue.serverTimestamp();
    this.crud.post('vehicle', { timestamp: time }).then(res => {


      // return;
      // console.log(webcamImage.imageAsDataUrl.slice(23))
      // this.getImage(webcamImage.imageAsDataUrl.slice(23));
      const filename = res.id;
      this.crud.postfile("/vehicle/" + filename, this.selectedFiles.item(0)).then(ress => {
        ress.ref.getDownloadURL().then(u => {
          this.vehicledata.photoURL = u;
          // this.newsdata.imageURL=;
          this.crud.update('vehicle/' + res.id, this.vehicledata).then(() => {
            this.sendbackendtowork(this.vehicledata.photoURL).then(resss => {
              if (resss) {
                console.log(resss);

              }
            })
            //   this.uiblock = false;
          });

        });
      });
    });


  }

  handleDrop(filelist: FileList) {
    this.selectedFiles = filelist;
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles.item(0));
    reader.onload = (_event) => {
      this.imageuploadpreUrl = reader.result;
    }



    const time = firebase.firestore.FieldValue.serverTimestamp();
    this.crud.post('vehicle', { timestamp: time }).then(res => {


      // return;
      // imgfile.name = res.id;
      // console.log(webcamImage.imageAsDataUrl.slice(23))
      // this.getImage(webcamImage.imageAsDataUrl.slice(23));
      const filename = res.id;
      this.crud.postfile("/vehicle/" + filename, this.selectedFiles.item(0)).then(ress => {
        ress.ref.getDownloadURL().then(u => {
          this.vehicledata.photoURL = u;
          // this.newsdata.imageURL=;
          this.crud.update('vehicle/' + res.id, this.vehicledata).then(() => {
            //   this.uiblock = false;
            this.sendbackendtowork(this.vehicledata.photoURL).then(resss => {
              if (resss) {
                console.log(resss);
                

              }
            });
          });

        });
      });
    });

  }

  dropactivestatus(event: boolean) {
    this.dropactive = event;

  }




  clearBucket() {
    this.selectedFiles = null;
    this.imageuploadpreUrl = null;
  }


  async sendbackendtowork(imgurl: string) {
    const formData = new FormData();
    formData.append('imgurl', imgurl);
    return await this.req.post("http://127.0.0.1:8000/rec", formData).toPromise().then(resp => {
      if (resp && resp.text().toString() === "Success") {
        this.clearBucket();
        console.log("Success");
        return true;
      }
      return false;
    });
  }


}
