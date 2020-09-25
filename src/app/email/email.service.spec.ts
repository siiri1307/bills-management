import { TestBed } from "@angular/core/testing";
import { Bill } from "../bills/bill";
import { EmailService } from "./email.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("EmailService", () => {
  let service: EmailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmailService],
    });
    service = TestBed.get(EmailService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it("should be able to retrieve zip archive from API via get", () => {
    const debug = { hello: "world" };

    const dummyBlob = new Blob([JSON.stringify(debug, null, 2)], {
      type: "application/zip",
    });

    service.getBillsZip(new Array<Bill>()).subscribe((files) => {
      expect(files).toEqual(dummyBlob);
    });

    const req = httpMock.expectOne(`${service["pdfUrl"]}`); // mock request
    expect(req.request.method).toBe("GET");
    req.flush(dummyBlob); // provide dummy values as a response
  });
});
