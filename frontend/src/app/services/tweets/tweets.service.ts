import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tweet, NewTweet} from 'src/app/interfaces/tweet';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // CREATE
  async createTweet(newTweet: NewTweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<Tweet>(`${environment.API_URL}/tweets/`, newTweet, {
      headers: headerOptions
    }).toPromise();
  }

  // READ
  async getTweets() {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets`).toPromise();
  }

  // UPDATE
  async editTweet(tweet: Tweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/${tweet._id}`, tweet, {
      headers: headerOptions
    }).toPromise();
  }

  // DELETE
  async deleteTweet(tweetId: string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/tweets/${tweetId}`, {
      headers: headerOptions
    }).toPromise();
  }

  // CREATE COMMENT
  async createComment(newComment: NewTweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<Tweet>(`${environment.API_URL}/tweets/  `, newComment, {
      headers: headerOptions
    }).toPromise();
  }

  //GET ALL COMMENTS
  async getComments(idTweet : string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.get<Tweet>(`${environment.API_URL}/tweets/${idTweet}`, {
      headers: headerOptions
    }).toPromise();
  }

  //DELETE A COMMENT
  async deleteComment(idComment : string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/tweets/${idComment}`, {
      headers: headerOptions
    }).toPromise();
  }

  //PUSH A LIKE
  async postLike(idTweet: string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<any>(`${environment.API_URL}/tweets/${idTweet}/like`, {}, {
      headers: headerOptions
    }).toPromise();
  }

  //DELETE A LIKE
  async deleteLike(idTweet : string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/tweets/${idTweet}/like`, {
      headers: headerOptions
    }).toPromise();
  }

  //GET ALL FAVORITES
  async getFavorites() {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.get<Tweet[]>(`${environment.API_URL}/favorites`, {
      headers: headerOptions
    }).toPromise();
  }

  //ADD TWEET TO FAVORITES
  async addFavorite(idTweet : string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<any>(`${environment.API_URL}/favorites/${idTweet}`,{},{
      headers: headerOptions
    }).toPromise();
  }

  //DELETE TWEET FROM FAVORITES
  async deleteFavorite(idTweet : string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/favorites/${idTweet}`, {
      headers: headerOptions
    }).toPromise();
  }

  //GET HASHTAG FILTER
  async getHashtags(hashtag: string){
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets/hashtag/${hashtag}`).toPromise();
  }
      
}
