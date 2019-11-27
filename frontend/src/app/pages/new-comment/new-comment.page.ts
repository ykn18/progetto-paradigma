import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NewTweet , Tweet} from 'src/app/interfaces/tweet';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.page.html',
  styleUrls: ['./new-comment.page.scss'],
})
export class NewCommentPage implements OnInit {
  
  newTweet = {} as NewTweet;
  idParentTweet : string;

  constructor( 
    private modalCtrl: ModalController,
    private tweetsService: TweetsService,
    private navParams: NavParams,
    private toastService: ToastService,
    private uniLoader: UniLoaderService
    ) { }

  ngOnInit() {
    const tweet : Tweet = this.navParams.get('tweet')
    this.idParentTweet = tweet._id;
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async commentTweet() {

    try {

      await this.uniLoader.show();
      this.newTweet.parent_id = this.idParentTweet;
      await this.tweetsService.createComment(this.newTweet);
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

    if (this.newTweet.tweet) {
        return !this.newTweet.tweet.length ||
        this.newTweet.tweet.length > 120;
      }
      return true;
    }
}
