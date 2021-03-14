import { Injectable } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserType } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private loadingController: LoadingController, private alertController: AlertController, private toastController: ToastController, private actionSheetController: ActionSheetController) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading!',
      backdropDismiss: true
    });
    await loading.present();
    return loading.id;
  }

  async dismissLoading(id?: string) {
    if (id && id != "")
      await this.loadingController.dismiss(null, null, id); //ternary did not work, as null would still count as an valid id, thus, not working. alas, had to use if else (bleh)
    else
      await this.loadingController.dismiss();
  }

  async presentAlert(title: string, text: string) {
    const alert = await this.alertController.create({
      header: title,
      message: text,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async confirmationAlert(title: string, description: string) {
    const alert = await this.alertController.create({
      header: title,
      message: description,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }, {
          text: 'OK',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    var returned;
    await alert.present();
    await alert.onDidDismiss().then((data) => { returned = data; });
    return returned.data;
  }

  async changeUserType() {
    var choice: UserType;
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose the new type for the user:',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Admin',
        handler: () => {
          actionSheet.dismiss(UserType.Admin);
          return false;
        }
      }, {
        text: 'Editor',
        handler: () => {
          actionSheet.dismiss(UserType.Editor);
          return false;
        }
      }, {
        text: 'User',
        handler: () => {
          actionSheet.dismiss(UserType.User);
          return false;
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss().then((data) => { choice = data.data });
    return choice;
  }

  async ShowToast(text: string, duration?: number) {
    const toast = await this.toastController.create({
      message: text,
      color: "tertiary",
      duration: (duration) ? duration : 2000,
      animated: true,
      mode: "ios"
    });
    await toast.present();
  }
}
