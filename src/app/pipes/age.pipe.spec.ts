import { AgePipe } from './age.pipe';

describe('AgePipe', () => {
  let pipe: AgePipe;

  beforeEach(() => {
    pipe = new AgePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Less than a year old" for age 0', () => {
    expect(pipe.transform(0)).toBe('Less than a year old');
  });

  it('should return "Less than a year old" for null', () => {
    expect(pipe.transform(null as any)).toBe('Less than a year old');
  });

  it('should return "1 year old" for age 1', () => {
    expect(pipe.transform(1)).toBe('1 year old');
  });

  it('should return "2 years old" for age 2', () => {
    expect(pipe.transform(2)).toBe('2 years old');
  });

  it('should return "5 years old" for age 5', () => {
    expect(pipe.transform(5)).toBe('5 years old');
  });
});
