/**
 * @title List 구현을 위한 React Custom Hook
 * @author pts
 * @date 210728
 * @version 1.0.1
 * @description 리스트,검색,페이지네이션
 */

import { useReducer, useCallback, useState } from 'react';
import _, { isNull } from 'lodash';

/**
 * 게시판 타입
 */
enum VIEW_TYPE {
    LIST = 0, // 리스트형
    CARD, // 카드 배열형
    GALLARY, // 이미지 겔러리형
    GRID, // 격자 배열형
}

/**
 * 검색 옵션
 */
declare interface SEARCH {
    data_key: string | null; // 검색 종류
    word: string | null; // 검색어
    start_date: number; // 검색날짜 부터
    end_date: number; // 검색날짜 까지
}

declare interface ITEM {
    id: string;
    checked: boolean;
    active: boolean;
    data: any;
}

type LIST = {
    [key: string]: ITEM;
};

/**
 * 페이지네이션
 */
declare interface PAGINATION {
    cnt_print: number; // 게시판 한페이지에 출력할 item 갯수
    // cnt_view_list: number; // STATE length와 동일
    page_side_length: number; // 현제 페이지 버튼 양 사이드에 출력할 페이지 넘버 버튼 갯수

    list_begin_iterator: ITEM | null; // 게시판 리스트 0번째 item
    list_end_iterator: ITEM | null; // 게시판 리스트 마지막 item

    pos_current: number; // 현재 출력중이 페이지 넘버
    pos_first: number; // 모든 리스트 중 페이지의 가장 처음 (즉 0)
    pos_last: number; // 모든 리스트 중 페이지의 가장 마지막 (즉 리스트전체길이 / 표시리스트 갯수)
    pos_begin: number; // 표시된 페이지네이션의 처음
    pos_end: number; // 표시된 페이지네이션의 끝
    pos_prev: number; // pos_current - 1
    pos_next: number; // pos_current + 1
}

/**
 * 관리형 상태 구조
 */
declare interface STATE {
    //length: number; // 리스트 데이터 갯수
    view_type: VIEW_TYPE; // 게시판 출력 타입
    search: SEARCH; // 검색 구조체
    pagination: PAGINATION; // 페이지네이션
    list: LIST; // 패키징 된 원본 데이터
    view_list: LIST; // sort 또는 searching 된 출력할 데이터
}

/** ***************************************************************** */
const calcPagination = (state: STATE, currentPage: number): PAGINATION => {
    const obj: PAGINATION = {
        ...state.pagination,
    };
    const list_size = _.size(state.list);

    obj.list_begin_iterator = state.list[0];
    obj.list_end_iterator = state.list[list_size - 1];

    obj.pos_first = 0;
    obj.pos_last = Math.ceil(list_size / obj.cnt_print);

    obj.pos_prev = currentPage < 1 ? 0 : currentPage - 1;
    obj.pos_next = currentPage >= obj.pos_last - 1 ? obj.pos_last - 1 : currentPage + 1;

    obj.pos_current = currentPage < 0 ? 0 : currentPage;
    obj.pos_current = currentPage >= obj.pos_last ? obj.pos_last : currentPage;

    obj.pos_begin = Math.floor(currentPage / obj.page_side_length) * obj.page_side_length;

    obj.pos_end = obj.pos_begin + obj.page_side_length;
    if (obj.pos_end >= obj.pos_last) {
        obj.pos_end = obj.pos_last;
    }

    // console.log(
    //     'calcPage : ',
    //     obj.pos_begin,
    //     obj.pos_current,
    //     obj.pos_end,
    //     obj.pos_last,
    //     obj.pos_prev,
    //     obj.pos_next,
    // );

    return obj;
};

/**
 * 데이터 관리 목적의 초기화 -- ** 내부 함수 **
 * @param data 배열 또는 객체형 파라미터
 * @returns 초기화 STATE 객체
 */
const initialize = (data: Record<string, any>, option: any = {}): STATE => {
    return {
        //length: _.size(data),
        view_type: VIEW_TYPE.LIST,
        search: {
            data_key: '',
            word: '',
            start_date: 0,
            end_date: 0,
        },
        pagination: {
            cnt_print: 10,
            page_side_length: 5,
            list_begin_iterator: null,
            list_end_iterator: null,
            pos_current: 0,
            pos_first: 0,
            pos_last: 0,
            pos_begin: 0,
            pos_end: 0,
            pos_prev: 0,
            pos_next: 0,
        },
        list: {},
        view_list: {},
    };
};

const refresh = (state: STATE, action: Record<string, any>) => {
    const obj = {
        ...state,
    };
    //obj.length = _.size(action.data);
    // 리스트 패키징
    obj.list = {};
    obj.view_list = {};

    _.map(action.data, (el, key) => {
        const _item = {
            id: key,
            checked: false,
            active: false,
            data: el,
        };
        obj.list[key] = _item;
        obj.view_list[key] = _item;
    });
    const _pagination = calcPagination(obj, obj.pagination.pos_current);

    return {
        ...obj,
        pagination: _pagination,
    };
};

// const update = (state: STATE, action: Record<string, any>) => {

// };

const reducer = (state: STATE, action: Record<string, any>) => {
    switch (action.type) {
        case 'CALLBACK':
            action.callback(state);
            return state;

        case 'LIST':
        case 'REFRESH':
            //            state.length = action.length;
            const _refreshList = refresh(state, action);

            return {
                ..._refreshList,
            };

        case 'ADD':
            return {
                ...state,
                //length: state.length + 1,
                list: {
                    ...state.list,
                    [action.id]: {
                        id: action.id,
                        checked: false,
                        active: false,
                        data: action.data,
                    },
                },
            };

        case 'APPEND':
            const _tmpState: STATE = { ...state };

            const currentListSize = _.size(_tmpState.list);
            const _tmpList = {};
            const _tmpViewList = {};

            _.forEach(action.data, (el, i) => {
                const appendKey = currentListSize + i;
                const _item = {
                    id: appendKey,
                    checked: false,
                    active: false,
                    data: el,
                };
                _tmpList[appendKey] = _item;
                _tmpViewList[appendKey] = _item;
            });

            _tmpState.list = { ..._tmpState.list, ..._tmpList };
            _tmpState.view_list = { ..._tmpState.view_list, ..._tmpViewList };
            _tmpState.pagination = calcPagination(_tmpState, _tmpState.pagination.pos_current);

            return _tmpState;

        case 'CHECK':
            state.list[action.id].checked = action.checked;
            return {
                ...state,
            };

        case 'CHECK_ALL':
            _.forEach(state.list, (el) => {
                el.checked = action.checked;
            });
            return {
                ...state,
            };

        case 'UPDATE':
            state.list[action.id].data = action.data;
            return {
                ...state,
            };

        case 'DELETE':
            delete state.view_list[action.id];
            delete state.list[action.id];
            return {
                ...state,
            };

        case 'MOVE_PAGE':
            const _key = Object.keys(state.list);
            const _keyLength = _key.length;
            if (_keyLength <= 0)
                return {
                    ...state,
                };

            const obj = calcPagination(state, action.pos_current);
            state.pagination = obj;

            /* view_list 구성 */
            state.view_list = {};
            const i = action.pos_current * state.pagination.cnt_print;
            const loopLen = _keyLength < state.pagination.cnt_print ? _keyLength : state.pagination.cnt_print;

            for (let j = 0; j < loopLen; ++j) {
                if (i + j >= _keyLength) break;
                state.view_list[_key[i + j]] = state.list[_key[i + j]];
            }

            return {
                ...state,
            };

        default:
            return state;
    }
};

function useList(initialData = {}) {
    const [state, dispatch] = useReducer(reducer, initialize(initialData));
    const [nextId, setNextId] = useState(_.size(initialize(initialData).list) + 1);

    const getCheckItems = useCallback(() => {
        const pArr: Record<string, any> = {};
        _.forEach(state.list, (el, i) => {
            if (el.checked === true) {
                pArr[i] = el;
            }
        });
        return pArr;
    }, [state]);

    const setSearch = useCallback(
        (obj = null): STATE => {
            const _search: SEARCH = {
                data_key: obj?.data_key ? obj.data_key : '',
                word: obj?.word ? obj.word : '',
                start_date: obj?.start_date ? obj.start_date : 0,
                end_date: obj?.start_date ? obj.end_date : 0,
            };

            state.search = _search;
            return {
                ...state,
            };
        },
        [state.search],
    );

    const onChoice = useCallback(
        (e): ITEM => {
            const { id } = e.currentTarget;

            _.forEach(state.list, (el) => {
                el.active = false;
            });

            state.list[id].active = true;
            return state.list[id];
        },
        [state],
    );

    const onResetChoice = useCallback((): void => {
        _.forEach(state.list, (el) => {
            el.active = false;
        });
    }, [state]);

    /**
     * reducer dispatch
     */
    const onCheckedAll = useCallback((checked): void => {
        dispatch({
            type: 'CHECK_ALL',
            checked,
        });
    }, []);

    const onRefresh = useCallback((data = [], count = 0): void => {
        setNextId(_.size(data));
        dispatch({
            type: 'REFRESH',
            data,
            length: count,
        });
    }, []);

    const onChecked = useCallback((e): void => {
        const { id, name, checked } = e.target;

        console.log({ id, name, checked });

        dispatch({
            type: 'CHECK',
            id: name,
            checked,
        });
    }, []);

    const onAdd = useCallback(
        (data): void => {
            const newId = nextId;

            dispatch({
                type: 'ADD',
                id: newId,
                data,
            });
            setNextId(nextId + 1);
        },
        [nextId],
    );

    const onAppend = useCallback(
        (data): void => {
            dispatch({
                type: 'APPEND',
                data,
            });
            setNextId(nextId + _.size(data));
        },
        [nextId],
    );

    const onUpdate = useCallback((e, data): void => {
        const { id } = e.target;
        dispatch({
            type: 'UPDATE',
            id,
            data,
        });
    }, []);

    const onDelete = useCallback((e, _id = null): void => {
        const pId = isNull(_id) ? e.target.id : _id;

        dispatch({
            type: 'DELETE',
            id: pId,
        });
    }, []);

    /**
     * 비동기 콜백 실행
     */
    const onCallback = useCallback(
        async (callback) => {
            dispatch({
                type: 'CALLBACK',
                callback,
            });
        },
        [state],
    );

    /**
     * pagination functions
     */
    const movePage = useCallback(
        (number): void => {
            dispatch({
                type: 'MOVE_PAGE',
                pos_current: number,
            });
        },
        [state],
    );

    /**
     * scroll Event Handler
     * how to use : useEffect(() => scrollEventListener(document), []);
     */
    const scrollEventListener = (
        selectors: any,
        pd_callback = () => {
            console.log('on Refresh');
        },
        pu_callback = () => {
            console.log('on load append');
        },
    ) => {
        const el = selectors;

        const pStart = { x: 0, y: 0 };
        const pStop = { x: 0, y: 0 };
        let ticking = false;

        const firstLastCheck = () => {
            if (!ticking) {
                const scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
                const windowHeight = window.innerHeight; // 스크린 창
                const fullHeight = document.body.scrollHeight; //  margin 값은 포함 x

                window.requestAnimationFrame((t) => {
                    if (scrollLocation <= 2) pd_callback();
                    if (scrollLocation + windowHeight >= fullHeight) pu_callback();

                    ticking = false;
                });
                return;
            }
            ticking = true;
        };

        const swipeStart = (e) => {
            if (typeof e['targetTouches'] !== 'undefined') {
                const touch = e.targetTouches[0];
                pStart.x = touch.screenX;
                pStart.y = touch.screenY;
            } else {
                pStart.x = e.screenX;
                pStart.y = e.screenY;
            }
        };

        const swipeEnd = (e) => {
            if (typeof e['changedTouches'] !== 'undefined') {
                const touch = e.changedTouches[0];
                pStop.x = touch.screenX;
                pStop.y = touch.screenY;
            } else {
                pStop.x = e.screenX;
                pStop.y = e.screenY;
            }

            swipeCheck();
        };

        const swipeCheck = () => {
            const changeY = pStart.y - pStop.y;
            const changeX = pStart.x - pStop.x;

            const uchangeY = pStop.y - pStart.y;
            const uchangeX = pStop.x - pStart.x;

            // console.log(changeX, changeY, isPullDown(changeY, changeX));

            if (isPullDown(changeY, changeX)) {
                console.log('Swipe Down!');
                firstLastCheck();
            }
            if (isPullDown(uchangeY, uchangeX)) {
                console.log('Swipe Up!');
                firstLastCheck();
            }
        };

        const isPullDown = (dY, dX) => {
            // methods of checking slope, length, direction of line created by swipe action
            return (
                dY < 0 &&
                ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) || (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
            );
        };

        /* 모바일 터치 감지 */
        el.addEventListener('touchstart', swipeStart);
        el.addEventListener('touchend', swipeEnd);
        /* 마우스 감지 */
        el.addEventListener('scroll', firstLastCheck);

        return () => {
            el.removeEventListener('touchstart', swipeStart);
            el.removeEventListener('touchend', swipeEnd);
            el.removeEventListener('scroll', firstLastCheck);
        };
    };

    return {
        state,
        getCheckItems,
        setSearch,
        onChoice,
        onResetChoice,
        onChecked,
        onCheckedAll,
        onRefresh,
        onUpdate,
        onDelete,
        onAdd,
        onAppend,

        pages: state.pagination,
        movePage,
        onCallback,

        /**
         * scroll Event Handler
         * how to use : useEffect(() => scrollEventListener(document), []);
         */
        scrollEventListener,
    };
}

export default useList;
