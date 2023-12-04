import { ActivityManager } from "./activity-manager";
import { Service } from "./service";

export class Message {
    readonly activityManager: ActivityManager;

    readonly category: string;

    readonly handle: object;

    readonly isSubscription: boolean;

    readonly ls2Message: object;

    readonly method: string;

    readonly payload: Record<string, any>;

    readonly sender: string;

    readonly service: Service;

    readonly token: string;

    readonly uniqueToken: string;

    constructor(message: object, handle: object, activityManager: ActivityManager, service: Service);

    cancel(response: Record<string, any>): void;

    respond(response: Record<string, any>): boolean;
}
