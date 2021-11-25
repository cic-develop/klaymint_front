import { createAction, handleActions, Action } from 'redux-actions';
import { applyPenders } from 'redux-pender';
/** ***************** declare  ****************** */
export interface klipQR {
    expiration_time: number;
    request_key: string;
    status: string;
    type: string;
    device: string;
}

export interface CollectionsDetailContractInfoProps {
    list: any;
    total: any;
}

type BREAKPOINT_TYPE = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/** ***************** inner Function  ****************** */
const _generateBreakpoint = (): BREAKPOINT_TYPE => {
    if (window.innerWidth >= 1400) return 'xxl';
    if (window.innerWidth >= 1200) return 'xl';
    if (window.innerWidth >= 992) return 'lg';
    if (window.innerWidth >= 768) return 'md';
    if (window.innerWidth >= 576) return 'sm';
    return 'xs';
};

/** ***************** LocalStorage Key Names ****************** */

export const keyNameAutoLogin = 'autologin';
export const keyNameLanguage = 'klayLanguage';

/** ***************** ACTIONS ****************** */
const LANGUAGE = 'GLOBAL_STATUS/LANGUAGE';
const SERVER = 'GLOBAL_STATUS/SERVER';
const MOBILE = 'GLOBAL_STATUS/MOBILE';
const ORIENTATION = 'GLOBAL_STATUS/ORIENTATION';
const AUTOLOGIN = 'GLOBAL_STATUS/AUTOLOGIN';

const MODAL = 'GLOBAL_STATUS/MODAL';
const BREAKPOINT = 'GLOBAL_STATUS/BREAKPOINT';
const klipQR = 'GLOBAL_STATUS/QR_CANVAS';

const contractListInfo = 'GLOBAL_STATUS/CONTRACT_LIST';

/** ***************** ACTION FUNCTIONS ****************** */
export const pingServer = createAction(SERVER);
export const setLanguage = createAction(LANGUAGE, (data: string) => data);
export const isMobile = createAction(MOBILE);
export const isOrientation = createAction(ORIENTATION);

export const autologin = createAction(AUTOLOGIN, (data: boolean) => data);
export const setModal = createAction(MODAL, (data: boolean) => data);

export const setKlipQR = createAction(klipQR, (data: klipQR | klipQR[] | null) => data);
export const detectedBreakpoint = createAction(BREAKPOINT);

export const setContractListInfo = createAction(contractListInfo, (data) => data);

const initialState = {
    Language_browser: navigator.language,
    language: localStorage.getItem(keyNameLanguage) ? localStorage.getItem(keyNameLanguage) : 'en-US',
    server: null,
    mobile: Boolean(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)),
    breakpoint: _generateBreakpoint(),
    orientation: !navigator.maxTouchPoints ? 'desktop' : !window.orientation ? 'portrait' : 'landscape',
    autoconn: localStorage.getItem(keyNameAutoLogin) === '1' ? true : false,
    klipQR: null,
    contractListInfo: '',
};

const reducer = handleActions(
    {
        [SERVER]: (state, action: Action<any>) => ({
            ...state,
            server: action.payload.data,
        }),

        [LANGUAGE]: (state, action) => {
            let _language = null;
            if (action?.payload === undefined || action?.payload === null) {
                _language = localStorage.getItem(keyNameLanguage) ? localStorage.getItem('klayLenguage') : 'en-US';
            } else {
                localStorage.setItem(keyNameLanguage, action.payload);
                _language = action.payload;
            }

            return {
                ...state,
                language: action.payload,
            };
        },

        [MOBILE]: (state) => ({
            ...state,
            mobile: Boolean(
                navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i),
            ),
        }),

        [ORIENTATION]: (state) => ({
            ...state,
            orientation: !navigator.maxTouchPoints ? 'desktop' : !window.orientation ? 'portrait' : 'landscape',
        }),

        [AUTOLOGIN]: (state, action) => {
            let _autoconn = false;
            if (action?.payload === undefined || action?.payload === null) {
                _autoconn = localStorage.getItem(keyNameAutoLogin) === '1' ? true : false;
            } else {
                localStorage.setItem(keyNameAutoLogin, action.payload ? '1' : '0');
                _autoconn = action.payload;
            }

            return {
                ...state,
                autoconn: _autoconn,
            };
        },

        [MODAL]: (state, action) => ({
            ...state,
            modal: action.payload,
        }),

        [BREAKPOINT]: (state, action) => {
            return {
                ...state,
                breakpoint: _generateBreakpoint(),
            };
        },

        [klipQR]: (state, action) => ({
            ...state,
            klipQR: action.payload,
        }),

        [contractListInfo]: (state, action) => ({
            ...state,
            contractListInfo: action.payload,
        }),
    },
    initialState,
);

export default applyPenders(reducer, [
    {
        type: SERVER,
        onPending: (state, action) => {
            return state;
        },
        onSuccess: (state, action) => ({
            ...state,
            server: action.payload.data,
        }),
        onFailure: (state, action) => {
            console.log('onFailure', action.payload);
            return {
                ...state,
                server: null,
            };
        },
    },
]);
