import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-pop-up",
  templateUrl: "./pop-up.component.html",
  styleUrls: ["./pop-up.component.css"],
})
export class PopUpComponent implements OnInit {
  @Input() popUpOpen: boolean;
  @Input() emails: string[];
  @Output() popUpOpenChange = new EventEmitter<boolean>();
  @Output() sendBtnClicked = new EventEmitter<string[]>();

  private selectedEmails: string[] = [];

  constructor() {}

  ngOnInit() {}

  closePopUp(open: boolean) {
    this.selectedEmails = [];
    this.popUpOpenChange.emit(open);
  }

  checkedStateChanged(email: string, event: any) {
    if (event.currentTarget.checked) {
      if (!this.selectedEmails.includes(email)) {
        this.selectedEmails.push(email);
      }
    } else {
      if (this.selectedEmails.includes(email)) {
        this.selectedEmails.splice(this.selectedEmails.indexOf(email), 1);
      }
    }
  }

  sendEmails() {
    this.sendBtnClicked.emit(this.selectedEmails);
    this.closePopUp(false);
    this.selectedEmails = [];
  }
}
