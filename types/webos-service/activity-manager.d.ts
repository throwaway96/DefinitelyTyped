import { Service } from "./service";
import { Subscription } from "./subscription";

/**
 * Must set either foreground, background, or immediate and priority.
 */
export interface Type {
    /** Activity runs in foreground. */
    readonly foreground?: boolean | undefined;
    /** Do not set on webOS OSE. */
    readonly background?: boolean | undefined;
    /** Activity runs immediately. Also set priority. */
    readonly immediate?: boolean | undefined;
    /**
     * Activity will be re-launched until completed or explicitly stopped/canceled.
     * Not used on webOS OSE according to LG documentation.
     */
    readonly priority?: "highest" | "high" | "normal" | "low" | "lowest" | undefined;
    /** Not used on webOS TV or OSE according to LG documentation. */
    readonly userInitiated?: boolean | undefined;
    /** Store activity in persistent database. */
    readonly persist?: boolean | undefined;
    /** Do not cancel activity when unsubscribing from parent. */
    readonly explicit?: boolean | undefined;
    /** Activity does not expire after completion. */
    readonly continuous?: boolean | undefined;
    /** Device must remain powered while this activity runs. */
    readonly power?: boolean | undefined;
    /** Activity expected to complete quickly. */
    readonly powerDebounce?: boolean | undefined;
}

export interface Activity {
    readonly description: string;
    readonly name: string;
    readonly type?: Type | undefined;
}

export interface ActivitySpec {
    readonly activity: Activity;
    readonly replace?: boolean | undefined;
    readonly start?: boolean | undefined;
    readonly subscribe?: boolean | undefined;
}

export interface CreateRealCallback extends ActivitySpec {
    /** IDs returned from com.webos.service.activitymanager are integers. */
    readonly activityId: number;
}

/** Used on webOS TV 4.0 and OSE. */
export interface CreateDummyCallback {
    activity: { name: string };
    /** IDs used for internal activities are strings starting with "dummy_". */
    readonly activityId: string;
    /** Used on webOS TV 4.0 and OSE but not TV 6. */
    readonly isDummyActivity: boolean;
}

/** Used on webOS TV 6. */
export interface CreateInternalCallback {
    activity: { name: string };
    /** IDs used for internal activities are strings starting with "internal_". */
    readonly activityId: string;
    /** Replaces isDummyActivity on webOS TV 6. */
    readonly isInternalActivity: boolean;
}

export class ActivityManager {
    readonly service: Service;

    /** Time until exit when idle. Defaults to 5. */
    idleTimeout: number;

    /**
     * When false, logs a message instead of exiting on timeout.
     * Set to false if process args include --disable-timeouts.
     */
    exitOnTimeout: boolean;

    /**
     * Don't actually create activities when create() is called.
     * Set if process args include --disable-activity-creation.
     * Present on webOS TV 4.0 and OSE but not TV 6.
     */
    useDummyActivity: boolean;

    /**
     * @param service Used for calls/subscriptions.
     * @param idleTimeout Defaults to 5.
     */
    constructor(service: Service, idleTimeout?: number);

    /** Calls com.webos.service.activitymanager/adopt. */
    adopt(activity: Record<string, any>, callback?: (payload: Record<string, any>) => void): void;

    /**
     * Mark activity as complete and remove from _activities.
     * @param options Added to payload for call to luna://com.webos.service.activitymanager/complete
     *                (only occurs for non-internal activities).
     * @param callback Called after activity removed.
     * @returns If activity previously completed, false; otherwise nothing.
     */
    complete(
        activity: Record<string, any>,
        options?: Record<string, any>,
        callback?: (payload: Record<string, any>) => void,
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ): boolean | void;

    /**
     * If spec is a string, calls _createInternal() or _createDummy(); otherwise
     * calls _createActual().
     */
    create(spec: string | Record<string, any>, callback: (spec: CreateRealCallback) => void): void;

    private readonly _activities: { [id: number | string]: Subscription };

    /** Used by _createInternal() to give each new internal activity a unique ID. */
    private _counter: number;

    /**
     * Used by _createInternal() to give each new internal activity a unique
     * ID. Replaced by _internalActivityId on webOS TV 6.
     */
    private _dummyActivityId: number;

    /**
     * Used by _createInternal() to give each new internal activity a unique ID.
     * Not present on webOS TV 4.0 or OSE.
     */
    private _internalActivityId: number;

    private _idleTimer: NodeJS.Timeout | null;

    /** Adds an activity to _activities. Calls _stopTimer(). */
    private _add(id: string, activity: Subscription): void;

    /** Creates an activity with a call to com.webos.service.activitymanager. */
    private _createActual(activitySpec: ActivitySpec, callback?: (spec: CreateRealCallback) => void): void;

    /**
     * Does not exist on webOS TV 6.
     * @param callback Called with the newly created spec after activity is added.
    */
    private _createDummy(jobId: string, callback?: (spec: CreateDummyCallback) => void): void;

    /**
     * @param callback Called with the newly created spec (fake on webOS TV 6) after activity is added.
    */
    private _createInternal(jobId: string, callback?: (spec: CreateRealCallback | CreateInternalCallback) => void): void;

    /** Calls _startTimer() when the last activity is removed. */
    private _remove(id: string): void;

    /** Starts the idle timer if it's not already running. */
    private _startTimer(): void;

    /** Disables the idle timer. */
    private _stopTimer(): void;

    /**
     * Pointless timer used in unified_service mode on webOS 6.
     * Not present on webOS TV 4.0 or OSE.
     */
    private _idleDummyTimer: NodeJS.Timeout | undefined;

    /** Starts a 60 second timer (_idleDummyTimer) to print a message.
     * Used only in unified_service mode on webOS 6.
     * Not present on webOS TV 4.0 or OSE.
     */
    private _startDummyTimer(): void;
}
