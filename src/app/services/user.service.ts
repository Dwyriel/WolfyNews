import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, UserType } from '../classes/user';
import { first, map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collection = "Users";
  constructor(private fireDatabase: AngularFirestore, public auth: AngularFireAuth) { }

  async addUser(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password).then(async ans => {
      try {
        return this.fireDatabase.collection(this.collection).doc(ans.user.uid).set({
          name: user.name,
          email: user.email,
          userType: user.userType
        });
      } catch (e) {
        this.auth.user.subscribe(ans_1 => ans_1.delete());
      }
    });
  }

  getAll() {
    return this.fireDatabase.collection<User>(this.collection).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data() }))
    ));
  }

  get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<User>(id).valueChanges();
  }

  update(user: User) {//trying using firebase's update methods, but it requires a recent login, which I'll not be doing as off right now. code below
    /*this.auth.currentUser.then(ans => {ans.updatePassword(user.password)});
    this.auth.currentUser.then(ans => {ans.updateEmail(user.email)});*/
    return this.fireDatabase.collection(this.collection).doc(user.id).update({
      name: user.name,
      email: user.email,
      userType: user.userType
    });
  }

  updateType(id: string, userType: UserType) {
    return this.fireDatabase.collection(this.collection).doc(id).update({ userType: userType });
  }

  updatePhoto(id: string, photo: string) {
    return this.fireDatabase.collection(this.collection).doc(id).update({ photo: photo });
  }

  delete(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
