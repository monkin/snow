module may {
    
    export interface Set<T> {
        [key: string]: T;
    }
    
    export class Identified {
        private static sequence: number = 1
        public id: number = Identified.sequence++
    }
    
    export interface Disposable {
        dispose(): void;
    }
    
    export function using<T1 extends Disposable, R>(v: T1, callback: { (v: T1):R }): R;
    export function using<T1 extends Disposable, T2 extends Disposable, R>(v1: T1, v2: T2, callback: { (v1: T1, v2: T2):R }): R;
    export function using<T1 extends Disposable, T2 extends Disposable, T3 extends Disposable, R>(v1: T1, v2: T2, v3: T3, callback: { (v1: T1, v2: T2, v3: T3):R }): R;
    
    export function using(...args) {
        var l = args.length - 1,
            result;
        try {
            result = args[l].apply(null, args);
        } finally {
            for (var i = 0; i < l; i++) {
                args[i].dispose();
            }
        }
        return result;
    }
}
