declare global {
    interface Window {
        console?: typeof console;
    }
}

/**
 * Window.console overriding....
 * process.env.NODE_ENV를 사용하여 Enable
 * process.env.NODE_ENV !== 'development' 일떄 아래 함수를 사용
 */
export const _console = (function (oldCons: any): any {
    return {
        log: function (text: any) {
            //oldCons.log(text);
        },
        info: function (text: any) {
            //oldCons.info(text);
        },
        warn: function (text: any) {
            oldCons.warn(text);
        },
        error: function (text: any) {
            oldCons.error(text);
        },
    };
})(window.console);

window.console = process.env.NODE_ENV === 'development' ? window.console : _console;
