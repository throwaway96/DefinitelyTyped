/// <reference types="node" />

import { EventEmitter } from "events";

export class Subscription extends EventEmitter {
    readonly args: Record<string, any>;

    readonly handle: object;

    readonly request: object;

    readonly uri: string;

    constructor(handle: object, uri: string, args: Record<string, any>);

    cancel(): void;
}
