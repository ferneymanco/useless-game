export interface TestOption {
  text: string;
  roleWeight: string;
}

export interface AptitudeQuestion {
  id?: string;
  text: string;
  order: number;
  options: TestOption[];
}
