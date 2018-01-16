export class Task {
    taskID: number;
    parentTaskID: number;
    title: string;
    description: string;
    owner: string;
    oUserName: string;
    oEmail: string;
    secondaryOwner: string;
    soUserName: string;
    soEmail: string;
    performer: string;
    pUserName: string;
    pEmail: string;
    secondaryPerformer: string;
    spUserName: string;
    spEmail: string;
    reviewer: string;
    rUserName: string;
    rEmail: string;
    approver: string;
    aUserName: string;
    aEmail: string;
    due: string;
    completed: string;
    updated: string;
    frequency: string;
    category: string;
    stateID: number;
    state: string;
    statusID: number;
    repeatID: number;
}

export class TaskState {
    taskId: number;
    taskStateId: number;
}

export class TaskStatus {
    taskId: number;
    taskStatusId: number;
}

export class PotsTask {
    taskID: number;
    title: string;
    description: string;
    departmentID: number;
    department: string;
    categoryID: number;
    category: string;
    ownerID: number;
    owner: string;
    oUserName: string;
    oEmail: string;
    secondaryOwnerID: number;
    secondaryOwner: string;
    soUserName: string;
    soEmail: string;
    performerID: number;
    performer: string;
    pUserName: string;
    pEmail: string;
    secondaryPerformerID: number;
    secondaryPerformer: string;
    spUserName: string;
    spEmail: string;
    reviewerID: number;
    reviewer: string;
    rUserName: string;
    rEmail: string;
    approverID: number;
    approver: string;
    aUserName: string;
    aEmail: string;
    frequencyID: number;
    frequency: string;
    startDate: Date;
    endDate: Date;
    remindDays: number;
    stateID: number;
    state: string;
}

export class InsertTask {
    taskID: number;
    title: string;
    description: string;
    domainID: string;
    departmentID: number;
    categoryID: number;
    ownerID: number;
    secondaryOwnerID: number;
    taskStatus: number;
    taskState: number;
    performerID: number;
    secondaryPerformerID: number;
    reviewerID: number;
    approverID: number;
    frequencyID: number;
    startDate: number;
    endDate: number;
    remindDays: number;
}

export class SubTask {
    parentTaskID: number;
    childTaskID: number;
}

export class Audit {
    taskID: number;
    action: string;
    userName: string;
}

export class Repeat {
    taskID: number;
    repeatID: number;
}