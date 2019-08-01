import { TestBed } from '@angular/core/testing';

import { PDFService } from './pdf.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('PDFService', () => {
  let service: PDFService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [PDFService]
  });
    service = TestBed.get(PDFService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be able to retrieve zip archive from API via get', () => {

    var debug = {hello: "world"};

    const dummyBlob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/zip'});

    service.get().subscribe(files => {
      expect(files).toEqual(dummyBlob);
    });

    const req = httpMock.expectOne(`${service.pdfUrl}`); //mock request
    expect(req.request.method).toBe("GET");
    req.flush(dummyBlob); //provide dummy values as a response
  })

});
