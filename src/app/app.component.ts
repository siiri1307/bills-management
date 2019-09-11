import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pageTitle = 'korteriühistu veeb';

  public constructor(private titleService: Title) {
    this.titleService.setTitle("Korteriühistu Veeb");
  }

}
