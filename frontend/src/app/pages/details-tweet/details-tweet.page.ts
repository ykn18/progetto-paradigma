import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NewTweet , Tweet} from 'src/app/interfaces/tweet';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-details-tweet',
  templateUrl: './details-tweet.page.html',
  styleUrls: ['./details-tweet.page.scss'],
})
export class DetailsTweetPage implements OnInit {
  user : User = {"name" : "giorgio", "email" : "gg@g.it", "surname" : "marl"};
  comment1 : Tweet = {"_author" : this.user, "_id" : "22", "created_at" : "21:02.12", "tweet":"bel tweet"};
  comment2 : Tweet = {"_author" : this.user, "_id" : "22", "created_at" : "21:02.12", "tweet":"bel tweet"};
  comment3 : Tweet = {"_author" : this.user, "_id" : "22", "created_at" : "21:02.12", "tweet":"bel tweet"};
  comments: Tweet[] = [this.comment1, this.comment2, this.comment3];
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

  ngOnInit() {
    const tweet : Tweet = this.navParams.get('tweet');
    this.idParentTweet = tweet._id;
  }


  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async commentTweet() {

    try {

      await this.uniLoader.show();
      this.newComment.parent_id = this.idParentTweet;
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
      return 'You';
    } else {
      return tweet._author.name + ' ' + tweet._author.surname;
    }
  }


  onLike(){
    this.like_bool = !this.like_bool;
  }


}
