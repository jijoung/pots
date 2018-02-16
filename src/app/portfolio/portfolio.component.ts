import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { Fund } from '../model/assignment';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  portfolios: Array<any>;
  // companies: Array<any>;

  // portfolio_name: string;
  // abbrev_name: string;
  // selectedCompany: number;

  // fund = new Fund();

  // added = false;

  constructor(
    public potService: PotService,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.potService.getPortfolios(this.user.getUserID()).subscribe(res => {
      this.portfolios = res;
      console.log(this.portfolios);
    })
  }

  rowInsert(e) {
    console.log(e);
    if (e.data.fundName && e.data.abbrevName && e.data.company && e.data.signer && e.data.title) {
      console.log('Insert Row');
      this.potService.insertFund(e.data).subscribe(res => {
        this.ngOnInit();
      })
    } else {
      alert('Fill out all the fields to add a new fund');
      this.ngOnInit();
    }
  }

  rowRemove(e) {
    this.potService.DeleteFund(e.data).subscribe(res => {
      this.ngOnInit();
    })
  }

  rowUpdate(e) {
    console.log(e);
    var data = Object.assign(e.oldData, e.newData);
    console.log(data);
    this.potService.updateFund(data).subscribe(res => {
      this.ngOnInit();
    })
  }

  logEvent(msg) {
    console.log(msg);
  }
}
