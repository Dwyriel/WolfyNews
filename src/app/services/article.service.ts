import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Article } from '../classes/article';
import { CommentService } from './comment.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private collection = "Articles";
  constructor(private fireDatabase: AngularFirestore, private commentService: CommentService) { }

  add(article: Article) {
    return this.fireDatabase.collection(this.collection).add({
      active: article.active,
      title: article.title,
      content: article.content,
      authorId: article.authorId,
      date: new Date().getTime(),
    });
  }

  getAll() {
    return this.fireDatabase.collection<Article>(this.collection).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))
    ));
  }

  getAllActive() {
    return this.fireDatabase.collection<Article>(this.collection, ref => ref.where('active', '==', true)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))
    ));
  }

  getAllWithOptions(options?: { orderBy?: string, limit?: number }) {
    return this.fireDatabase.collection<Article>(this.collection, ref => ref.where('active', '==', true).orderBy((options && options.orderBy) ? options.orderBy : 'date', 'desc').limit((options && options.limit) ? options.limit : 3)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))
    ));
  }

  get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<Article>(id).valueChanges();
  }

  update(article: Article) {
    return this.fireDatabase.collection(this.collection).doc(article.id).update({
      active: article.active,
      title: article.title,
      content: article.content,
      authorId: article.authorId
    });
  }

  updateActive(id: string, active: boolean) {
    return this.fireDatabase.collection(this.collection).doc(id).update({ active: active });
  }

  async delete(id: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).delete().then(async () => await this.commentService.deleteCommentsFrom(id));
  }
}
