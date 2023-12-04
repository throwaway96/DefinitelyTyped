/// <reference types="node" />

import { EventEmitter } from "events";

export class Subscription extends EventEmitter {
    readonly args: Record<string, any>;

    readonly handle: object;

    readonly request: object;

    readonly uri: string;

    /**
     * @param sessionId Only present on webOS OSE.
     */
    constructor(handle: object, uri: string, args: Record<string, any>, sessionId?: string);

    cancel(): void;
}
