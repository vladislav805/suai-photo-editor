/**
 * Event:
 *   zoom
 *     delta:
 *        1 - zoom in;
 *       -1 - zoom out;
 *        0 - to fit
 *
 *   save
 *     name - filename
 *
 *   seek2history
 *     id - target entry of history
 *
 *   applyFilter
 *     filterId - name of filter
 */

export default class Connector {
    private static sInstance: Connector;

    public static getInstance(): Connector {
        if (!Connector.sInstance) {
            Connector.sInstance = new Connector;
        }

        return Connector.sInstance;
    }

    private mListeners: Record<string, Function[]>;

    private constructor() {
        this.mListeners = {};
    }

    public on = (event: string, listener: Function) => {
        if (!this.mListeners[event]) {
            this.mListeners[event] = [];
        }

        this.mListeners[event].push(listener);
    };

    public fire = (event: string, args = {}) => {
        if (this.mListeners[event]) {
            this.mListeners[event].forEach(listener => listener(args));
        }
    };

    public remove = (event: string, listener: Function) => {
        if (this.mListeners[event]) {
            const index = this.mListeners[event].indexOf(listener);

            if (~index) {
                this.mListeners[event].splice(index, 1);
            }
        }
    }
}
