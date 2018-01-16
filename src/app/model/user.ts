export class User {
    userId: number;
    userName: string;
    lastName: string;
    firstName: string;
    email: string;
    statusID: number;
    domainID: number;
    roleID: number;
}

export class ColumnSetting {
    userID: string;
    domainID: string;
    selectedColumns: string;
}