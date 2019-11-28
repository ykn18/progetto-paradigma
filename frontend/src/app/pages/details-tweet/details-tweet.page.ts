import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NewTweet , Tweet} from 'src/app/interfaces/tweet';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-details-tweet',
  templateUrl: './details-tweet.page.html',
  styleUrls: ['./details-tweet.page.scss'],
})

export class DetailsTweetPage implements OnInit {
  tweet : Tweet;
  comments: Tweet[] = [];
  newComment = {} as NewTweet;
  idParentTweet : string;

  constructor(
    private modalCtrl: ModalController,
    private tweetsService: TweetsService,
    private navParams: NavParams,
    private toastService: ToastService,
    private uniLoader: UniLoaderService,
    private auth: AuthService
    ) { }

  async ngOnInit() {
    const tweet : Tweet = this.navParams.get('tweet');
    this.idParentTweet = tweet._id;
    await this.getComments(); 
  }

  async getComments() {

    try {
      await this.uniLoader.show();
      this.tweet = await this.tweetsService.getComments(this.idParentTweet);
      this.comments = this.tweet.comments;
      await this.uniLoader.dismiss();

    } catch (err) {
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
  }


  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async commentTweet() {

    try {

      await this.uniLoader.show();
      this.newComment.parent = this.idParentTweet;
      await this.tweetsService.createComment(this.newComment);

    } catch (err) {
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
    await this.getComments();
    this.newComment.tweet = "";
    await this.uniLoader.dismiss();
  }

  isDataInvalid(): boolean {

    if (this.newComment.tweet) {
        return !this.newComment.tweet.length ||
        this.newComment.tweet.length > 120;
      }
      return true;
    }

  isMyTweet(tweet: Tweet): boolean {
    if (tweet._author) {
      return tweet._author._id === this.auth.me._id;
    }
    return false;
  }

  getAuthor(tweet: Tweet): string {

    if (this.isMyTweet(tweet)) {
      return 'You';
    } else {
      return tweet._author.name + ' ' + tweet._author.surname;
    }
  }

  getLikes(tweet: Tweet) {
    return tweet.likes.length;
  }

  hasLike(tweet) {
    let found = true;
    if (tweet.likes.length > 0) {
      for (let user_id of tweet.likes) {
        if (user_id == this.auth.me._id) {
          return found;
        }
      }
    }
    return !found;
  }

  async onLike(tweet){
    if (this.hasLike(tweet)){
      await this.tweetsService.deleteLike(tweet._id);
    }
    else{
      await this.tweetsService.postLike(tweet._id);
    }
    await this.getComments();
  }

}