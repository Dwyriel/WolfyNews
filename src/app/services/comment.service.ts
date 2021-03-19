import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserComment } from '../classes/user-comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private collection: string = "Comments";

  constructor(private fireDatabase: AngularFirestore) { }

  async add(comment: UserComment, articleid: string) {
    return await this.fireDatabase.collection(this.collection).add({
      articleId: articleid,
      text: comment.text,
      userId: comment.userId,
      date: new Date().getTime(),
    });
  }

  getAllFromArticle(id: string) {
    return this.fireDatabase.collection<UserComment>(this.collection, ref => ref.where('articleId', '==', id).orderBy('date')).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  async deleteCommentsFrom(id: string) {
    var comments: UserComment[];
    var subscription = this.getAllFromArticle(id).subscribe(async ans => {
      comments = ans;
      const batch = this.fireDatabase.firestore.batch();
      comments.forEach(value => {
        var ref = this.fireDatabase.firestore.collection(this.collection).doc(value.id);
        batch.delete(ref);
      });
      await batch.commit();
      subscription.unsubscribe();
    });
  }
}
