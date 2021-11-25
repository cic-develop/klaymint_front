/**
 * @title 페이지를 닫거나 새로고침 전 실행하는 middleware 같은 Hook
 * @author pts
 * @date 210729
 * @version 1.0.0
 * @description 새로고침 후 메모리와 seesionStorage 간의 세션 스왑용
 */

type callback = <T>(data?: any | null) => T | void;

const usePreventLeave = (callback: callback) => {
    const listener = (event: any) => {
        event.preventDefault();
        event.retrunValue = callback();
    };

    const enablePrevent = () => window.addEventListener('beforeunload', listener);
    const disablePrevent = () => window.removeEventListener('beforeunload', listener);
    return { enablePrevent, disablePrevent };
};

export default usePreventLeave;
