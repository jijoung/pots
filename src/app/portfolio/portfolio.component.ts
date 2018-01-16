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
  companies: Array<any>;

  portfolio_name: string;
  abbrev_name: string;
  selectedCompany: number;

  fund = new Fund();

  added = false;

  constructor(
    public potService: PotService,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.potService.getPortfolios(this.user.getUserID()).subscribe(res => {
      this.portfolios = res;
      //console.log(this.portfolios);
    })
    this.potService.getCompanies().subscribe(res => {
      this.companies = res;
      console.log(this.companies);
    })
  }

  addNewFund() {
    if (this.portfolio_name && this.abbrev_name && this.selectedCompany) {
      this.fund.FundName = this.portfolio_name;
      this.fund.AbbrevName = this.abbrev_name;
      this.fund.CompanyID = this.selectedCompany;
      this.potService.insertFund(this.fund).subscribe(res => {
        this.added = false;
        this.portfolio_name = undefined;
        this.abbrev_name = undefined;
        this.selectedCompany = undefined;
        this.ngOnInit();
      });
    } else {
      alert('Please fill out all the fields to add a fund');
    }
  }

  set() {
    this.added = true;
  }
}
