/**
 * @title 콜렉션 리스트 리덕스
 * @author pts
 * @date 20210730
 * @version 1.0.0
 * @description 객체를 리덕스 Wallet에 저장, Wallet와 SessionStorage Swap, Wallet와 SessionStorage 삭제
 */

import _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';

import { getContracts } from '@/helpers/klaymint.api';
import { actionTypes } from 'redux-pender/lib/utils';

export interface SORT {
    key: string;
    order: boolean;
}
export interface COLLECTIONS {
    total: Record<string, any> | null;
    list: Record<string, any>[];
    classs: Record<string, any>;
    sort: SORT;
    sns: Record<string, any>;
}

const initialState: COLLECTIONS = {
    total: null,
    list: [],
    classs: {},
    sort: {
        key: 'tvolume',
        order: true,
    },
    sns: {},
};

/** ***************** ACTIONS  ****************** */
const LOAD = 'COLLECTIONS/LOAD';
const SORTING = 'COLLECTIONS/SORTING';

/** ***************** ACTION FUNCTIONS ****************** */
export const loadCollections = createAction(LOAD, getContracts);
export const sortCollections = createAction(SORTING, (sort) => sort);

const reducer = handleActions(
    {
        [SORTING]: (state, action) => {
            const { sort } = action.payload;
            const list = _.sortBy(state.list, (el) => el[sort.key]);
            if (sort.order) _.reverse(list);

            return {
                ...state,
                list: [...list],
                sort: sort,
            };
        },
    },
    initialState,
);

export default applyPenders(reducer, [
    {
        type: LOAD,
        // onPending: (state, action) => {
        //     console.log('onPending', LOAD, action.payload);
        //     return state;
        // },
        onSuccess: (state, action) => {
            //console.log('onSuccess', LOAD, action.payload);

            //초기 정렬
            const { sort } = state;
            const list = _.sortBy(action.payload.data.list, (el) => el[sort.key]);
            if (sort.order) _.reverse(list);

            return {
                ...state,
                ...action.payload.data,
                list: list,
            };
        },
        onFailure: (state, action) => {
            console.log('onFailure', action.payload);
            return state;
        },
    },
]);
