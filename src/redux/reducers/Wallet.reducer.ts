/**
 * @title 세션관리용 리덕스
 * @author pts
 * @date 210730
 * @version 1.0.0
 * @description 객체를 리덕스 Wallet에 저장, Wallet와 SessionStorage Swap, Wallet와 SessionStorage 삭제
 */

import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import CryptoJS from 'crypto-js';

export interface WALLET_INFO {
    name: string;
    address: string;
    balance: number;
    network?: number;
    myToken: MY_TOKEN;
}

export interface WALLETS {
    isConn: boolean;
    type: 'none' | 'kaikas' | 'klip';
    info?: WALLET_INFO;
}

export interface MY_TOKEN {
    unlisted: any[];
    onSale: any[];
    gameItem: any[];
}

const initialState: WALLETS = {
    isConn: false,
    type: 'none',
    info: {
        name: '',
        address: '',
        balance: 0,
        network: 0,
        myToken: {
            unlisted: [],
            onSale: [],
            gameItem: [],
        },
    },
};

/** ***************** Orther Function  ****************** */
/**
 * AES 암호화된 SessionStorage Wallet Reducer 데이터를 복화하하여 Store에 저장
 */
const decryptValue = () => {
    const encrptWallet = process.env.REACT_APP_STORE_NAME
        ? sessionStorage.getItem(process.env.REACT_APP_STORE_NAME)
        : null;

    if (!encrptWallet) return null;
    if (!process.env.REACT_APP_PRIVATE_KEY) return null;

    const obj = JSON.parse(
        CryptoJS.AES.decrypt(encrptWallet, process.env.REACT_APP_PRIVATE_KEY).toString(CryptoJS.enc.Utf8),
    );
    process.env.REACT_APP_STORE_NAME && sessionStorage.removeItem(process.env.REACT_APP_STORE_NAME);

    return obj;
};

/**
 * Wallet Reducer를 AES 암호화하여 SessionStorage에 저장
 * @param data
 */
const encryptValue = (data: Record<string, any>) => {
    const encrptWallet = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_PRIVATE_KEY ? process.env.REACT_APP_PRIVATE_KEY : 'CICCOMMUNITY',
    ).toString();

    process.env.REACT_APP_STORE_NAME ? sessionStorage.setItem(process.env.REACT_APP_STORE_NAME, encrptWallet) : null;
};

/** ***************** ACTIONS  ****************** */
const LOAD_WALLET = 'WALLET/LOAD_WALLET';
const SAVE_WALLET = 'WALLET/SAVE_WALLET';
const REMOVE_WALLET = 'WALLET/REMOVE_WALLET';
const SET_WALLET = 'WALLET/SET_WALLET';
const SET_ADDRESS = 'WALLET/SET_ADDRESS';
const SET_NETWORK = 'WALLET/SET_NETWORK';
const SET_TOKEN = 'WALLET/SET_TOKEN';
const RESET_WALLET = 'WALLET/RESET_WALLET';

// const INITIALIZE_KAIKAS_EXT_CHECK = 'WALLET/INITIALIZE_KAIKAS_EXT_CHECK';
// const RESET_KAIKAS_EXT_CHECK = 'WALLET/RESET_KAIKAS_EXT_CHECK';

/** ***************** ACTION FUNCTIONS ****************** */
export const loadWallet = createAction(LOAD_WALLET, (data: any) => data);
export const saveWallet = createAction(SAVE_WALLET, (data: any) => data);
export const removeWallet = createAction(REMOVE_WALLET);

export const setWallet = createAction(SET_WALLET, (data: any) => data);
export const setAddress = createAction(
    SET_ADDRESS,
    (data: { address: string; balance: number; myToken?: any }) => data,
);
export const setNetwork = createAction(SET_NETWORK, (data: any) => data);
export const setToken = createAction(SET_TOKEN, (data: any) => data);
export const resetWallet = createAction(RESET_WALLET);

const reducer = handleActions(
    {
        [LOAD_WALLET]: (state, action) => {
            const decode_data = decryptValue();

            //if (!decode_data || decode_data.type === 'klip') return { ...decode_data };
            if (!decode_data || decode_data.type === 'kaikas') return { ...initialState };
            return { ...decode_data };
        },

        [SAVE_WALLET]: (state, action) => {
            encryptValue(state);
            return state;
        },

        [REMOVE_WALLET]: (state) => {
            //유저 정보 세션 삭제
            process.env.REACT_APP_STORE_NAME && sessionStorage.removeItem(process.env.REACT_APP_STORE_NAME);
            return null;
        },

        [SET_WALLET]: (state, action) => {
            return { ...action.payload };
        },

        [SET_ADDRESS]: (state, action) => {
            const { address, balance, myToken }: any = action.payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    name: address.slice(0, 3) + '...' + address.slice(-3),
                    address: address,
                    balance: balance,
                    myToken: myToken ? myToken : state.info.myToken,
                },
            };
        },

        [SET_NETWORK]: (state, action) => {
            return {
                ...state,
                info: {
                    ...state.info,
                    network: action.payload,
                },
            };
        },

        [SET_TOKEN]: (state, action) => {
            return {
                ...state,
                info: {
                    ...state.info,
                    myToken: action.payload,
                },
            };
        },

        [RESET_WALLET]: (state, action) => {
            return { ...initialState };
        },
    },
    initialState,
);

export default applyPenders(reducer, [
    // {
    //     type: INITIALIZE_KAIKAS_EXT_CHECK,
    //     // onPending: (state, action) => {return state},
    //     onSuccess: (state, action) => {
    //         console.log('INITIALIZE_KAIKAS_EXT_CHECK_ID', action);
    //         return {
    //             ...state,
    //             server: action.payload.data,
    //         };
    //     },
    //     onFailure: (state, action) => {
    //         console.log('onFailure', action.payload);
    //         return {
    //             ...state,
    //             server: null,
    //         };
    //     },
    // },
]);
