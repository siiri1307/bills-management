import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "paymentStatusToText",
})
export class PaymentStatusToText implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 1:
        return "Paid";
      case 2:
        return "Partially paid";
      case 3:
        return "Not paid";
    }
  }
}
