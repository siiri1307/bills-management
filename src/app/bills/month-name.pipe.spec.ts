import { IntegerToMonthNamePipe } from "./month-name.pipe";

describe('IntegerToMonthNamePipe', () => {

    let pipe = new IntegerToMonthNamePipe();

    it('should transform integer to month name string', () => {
        expect(pipe.transform(7)).toBe('July');
    })

    it('should return undefined for illegal integer', () => {
        expect(pipe.transform(13)).toBe(undefined);
    })
})