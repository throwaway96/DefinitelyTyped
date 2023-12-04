import { ActivityManager } from "./activity-manager";
import { Message } from "./message";
import { Method } from "./method";
import { Subscription } from "./subscription";

export interface ServiceOptions {
    /** Idle time in seconds before exiting. */
    readonly idleTimer?: number | undefined;
    /** Prevents registering 'info' & 'quit' methods. */
    readonly noBuiltinMethods?: boolean | undefined;
}

export class Service {
    readonly activityManager: ActivityManager;

    readonly busId: string;

    readonly cancelHandlers: Record<string, any>;

    readonly handlers: Record<string, any>;

    readonly methods: { [category: string]: { [methodName: string]: Method } };

    /** Do not register 'info'/'quit'. Set to true when passed in options. */
    readonly noBuiltinMethods: boolean | undefined;

    readonly subscriptions: { [id: string]: Message };

    /** Set by cleanupUnified(). */
    readonly cleanupUnifiedDone: boolean | undefined;

    /** Luna bus handle when ACG is used. */
    readonly handle: object | undefined;

    /** Timeout for ActivityManager. Defaults to 5. */
    readonly idleTimer: number;

    /** Whether 'quit' is allowed on public bus. Set to true when a public method is registered. */
    readonly hasPublicMethods: boolean;

    /** Handle for private Luna bus if ACG not in use. */
    readonly privateHandle: object | undefined;

    /** Handle for public Luna bus if ACG not in use. */
    readonly publicHandle: object | undefined;

    /** Handle used for calls/subscriptions. Th  e private handle is used if privileged. */
    readonly sendingHandle: object;

    /** Whether new ACG security model is used. */
    readonly useACG: boolean;

    private readonly __serviceMainUnified: any;

    constructor(busId: string, activityManager?: ActivityManager, options?: ServiceOptions);

    call(uri: string, args: Record<string, any>, callback: (message: Message) => void): void;

    cancelSubscription(handle: any, ls2Message: any): void;

    cleanupUnified(): void;

    idIsPrivileged(id: string): boolean;

    info(message: Message): void;

    quit(message: Message): void;

    register(
        name: string,
        requestCallback?: (message: Message) => void,
        cancelCallback?: (message: Message) => void,
        description?: Record<string, any>,
    ): Method;

    registerPrivate(
        name: string,
        requestCallback?: (message: Message) => void,
        cancelCallback?: (message: Message) => void,
        description?: Record<string, any>,
    ): Method;

    subscribe(uri: string, args: Record<string, any>): Subscription;

    private _dispatch(handle: any, ls2Message: any): void;

    private _register(
        privateBus: boolean,
        name: string,
        requestCallback?: (message: Message) => void,
        cancelCallback?: (message: Message) => void,
        description?: Record<string, any>,
    ): Method;

    private _registerBuiltInMethods(privateBus: boolean): void;
}
