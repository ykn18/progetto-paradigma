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
  tweets : Tweet[] = [];
  comments: Tweet[] = [];
  like_bool : boolean = true;
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
      this.tweets = await this.tweetsService.getComments(this.idParentTweet);
      this.comments = this.tweets["comments"];
      console.log(this.tweets)
      await this.uniLoader.dismiss();
      console.log(this.comments)

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
      console.log(this.newComment)
      await this.tweetsService.createComment(this.newComment);
      await this.dismiss();
    } catch (err) {
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
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
      console.log("you");
      return 'You';
    } else {
      console.log("else");
      return tweet._author.name + ' ' + tweet._author.surname;
    }
  }

  onLike() {
    this.like_bool = !this.like_bool;
  }

  hasLike(tweet: Tweet) {
    if(tweet.likes.length > 0) {
      for (let like of tweet.likes) {
        return (like._id != this.auth.me._id) ? false : true;
      }
    }
    else {
      return false;
    }
  }


}
