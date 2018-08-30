export default class AddBlurEvent {
    constructor();
    clickListener: (e?: Event) => void;
    keydownListener: (e?: KeyboardEvent) => void;
    cleanEvent: () => void;
    setConfig: (config?: {
        addListener: boolean;
        blurCallback: (e?: Event) => void;
        clickIncludeElm?: HTMLElement | HTMLElement[];
        clickExcludeElm?: HTMLElement | HTMLElement[];
        keydownCallback?: (e?: KeyboardEvent) => void;
        blurKeyCodes?: number[];
    }) => void;
}
