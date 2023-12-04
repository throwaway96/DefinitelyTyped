/// <reference types="node" />

import { EventEmitter } from "events";
import { Message } from "./message";

export class Method extends EventEmitter {
    readonly description: Record<string, any>;

    readonly name: string;

    /** Present on webOS TV 6 but not TV 4.0 or OSE. */
    opts: Record<string, any>;

    /**
     * @param opts Present on webOS TV 6 but not TV 4.0 or OSE.
     */
    constructor(methodName: string, description: Record<string, any>, opts?: Record<string, any>);

    on(event: "request" | "cancel", listener: (message: Message) => void): this;

    on(event: string, listener: () => void): this;
}
