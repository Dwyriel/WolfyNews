import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AlertService } from './alert.service';
import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private actionSheetController: ActionSheetController, private alerService: AlertService) { }
}
