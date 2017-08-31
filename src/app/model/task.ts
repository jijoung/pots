export class Task {
    taskID: number;
    title: string;
    description: string;
    owner: string;
    performer: string;
    pUserName: string;
    reviewer: string;
    rUserName: string;
    approver: string;
    aUserName: string;
    due: string;
    completed: string;
    updated: string;
    frequency: string;
    category: string;
    statusID: number;
    state: string;
}

export class TaskState {
    taskId: number;
    taskStateId: number;
}

export class TaskStatus {
    taskId: number;
    taskStatusId: number;
}
