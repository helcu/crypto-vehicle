declare function createMergeFuncs(staticFunc?: () => void): (...funcs: Function[]) => (...args: any[]) => void;
export default createMergeFuncs;
