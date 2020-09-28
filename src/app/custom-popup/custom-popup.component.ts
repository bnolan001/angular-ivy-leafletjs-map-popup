import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.css']
})
export class CustomPopupComponent implements OnInit {
  @Input() customText: string
  constructor() { }

  ngOnInit() {
  }

}