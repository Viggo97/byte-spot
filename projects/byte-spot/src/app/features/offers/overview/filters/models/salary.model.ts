import { Range } from '@byte-spot-lib';

export class Salary extends Range {
    static readonly SalaryFrom = 0;
    static readonly SalaryTo = 50_000;

    static default(): Salary {
        return new Salary(Salary.SalaryFrom, Salary.SalaryTo);
    }
}
