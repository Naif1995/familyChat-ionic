import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  chats= [
    { id:'c1',
  describtion:'Chat 1',
  title:'chat 1',
  imageUrl:'https://thumbs.dreamstime.com/z/gorgeous-frangipani-flowers-6647154.jpg'
}
];
  constructor() {}


}
