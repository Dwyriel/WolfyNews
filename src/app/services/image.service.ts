import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AlertService } from './alert.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private actionSheetController: ActionSheetController, private alerService: AlertService) { }

  async alterPhoto() {
    var photoPath;
    const actionSheet = await this.actionSheetController.create({
      header: 'Existing or new photo?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          actionSheet.dismiss(this.takePhoto());
          return false;
        }
      }, {
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          actionSheet.dismiss(this.choosePhoto());
          return false;
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss().then((data) => { photoPath = data.data });
    return photoPath;
  }

  async takePhoto() {
    var imageUrl: string;
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: false,
    });
    imageUrl = image.dataUrl;
    return imageUrl;
  }

  async choosePhoto() {
    var imageUrl: string;
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      saveToGallery: false,
    });
    imageUrl = image.dataUrl;
    return imageUrl;
  }
}
