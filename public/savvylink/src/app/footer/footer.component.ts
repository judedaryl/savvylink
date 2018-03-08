import { ActivatedRoute } from '@angular/router/';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  hits: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.hits = data['hit']['results']['count'];
  }

}
