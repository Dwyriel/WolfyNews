import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Article } from '../classes/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private collection = "Articles";
  constructor(private fireDatabase: AngularFirestore, public auth: AngularFireAuth) { }

  add(article: Article) {
    return this.fireDatabase.collection(this.collection).add({
      active: article.active,
      title: article.title,
      content: article.content,
      authorId: article.authorId,
      date: new Date().toISOString(),
    });
  }

  getAll() {
    return this.fireDatabase.collection<Article>(this.collection).snapshotChanges().pipe(map(
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

  delete(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
