import { Component, OnInit } from "@angular/core";
import { BillService } from "../bills/bill.service";
import { PDFService } from "./pdf.service";
import { saveAs } from 'file-saver';

@Component({
    selector: 'debtors',
    templateUrl: './debtors.component.html'
})

export class DebtorsComponent {

    public debtsData: Array<any>;

    constructor(private PDFService: PDFService){
        PDFService.get().subscribe((data: any) => this.debtsData = data);
    }

    downloadPDF() {
        this.PDFService.get().subscribe(doc => {
            //var url = window.URL.createObjectURL(doc);
            //window.open(url);
            console.log("Downloaded: " + doc);
            var blob = new Blob([doc], {type: 'application/zip'});//inserts data to a blob. Blob is a file-like object of raw immutable data
            var fileName = 'test-bills.zip';
            saveAs(blob, fileName);
        })
    }

}