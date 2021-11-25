import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import _ from 'lodash';

declare interface OPTION {
    animation: boolean;
    autohide: boolean;
    delay: number;
}

declare interface TOAST {
    type: 'noti' | 'alert' | 'warning' | 'error' | 'success';
    locked?: boolean;
    option?: OPTION;
    title?: string;
    message?: string;
}

declare global {
    interface Window {
        toast?: any;
    }
}

/**
 * Toast Item Components
 * @description Toast Container Componenet의 toast 메서드를 통해 컨트롤 되는 Components
 */

const Toast: React.FC<any> = (props: any): JSX.Element => {
    const toastRef = useRef();
    const [hide, setHide] = useState(false);

    const { uuid }: { uuid: string } = props;
    const { type, title, message, option }: TOAST = props;

    useEffect(() => {
        const { current }: any = toastRef;
        const delay = option.delay ? option.delay : 3000;
        if (option.autohide) {
            setTimeout(() => {
                setHide(true);
            }, delay);
        }

        current.addEventListener('hidden.bs.toast', () => {});

        return current.removeEventListener('hidden.bs.toast', () => {});
    }, []);

    let faTypeClass = 'fas fa-bell';
    let toastColor = '';
    switch (type) {
        case 'success': {
            faTypeClass = 'fas fa-check';
            toastColor = 'bg-success text-white';
            break;
        }
        case 'noti': {
            faTypeClass = 'fas fa-bell';
            toastColor = 'bg-info';
            break;
        }
        case 'alert': {
            faTypeClass = 'fas fa-times-circle';
            toastColor = 'bg-secondary text-white';
            break;
        }
        case 'warning': {
            faTypeClass = 'fas fa-exclamation-circle';
            toastColor = 'bg-warning text-white';
            break;
        }
        case 'error': {
            faTypeClass = 'fas fa-times-circle';
            toastColor = 'bg-danger text-white';
            break;
        }
        default: {
            faTypeClass = 'fas fa-bell';
            toastColor = '';
        }
    }

    return (
        <div
            ref={toastRef}
            id={uuid}
            className={cx('toast', hide ? 'fade hide' : 'fade show')}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className={cx(title ? 'toast-header' : 'toast-body', toastColor)}>
                <strong className="me-auto">
                    <i className={faTypeClass} /> {title ? title : message}
                </strong>

                {/* <small className="text-muted">2 seconds ago</small> */}
                <button
                    type="button"
                    className="btn-close float-end"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>

            {title && <div className="toast-body">{message}</div>}
        </div>
    );
};

/**
 * Toast Container Components
 * @description Toast Container Componenet의 toast 메서드를 통해 컨트롤 되는 Components
 */
const Toast_Container: React.FC<any> = (props): JSX.Element => {
    var [toasts, setToasts] = useState({});

    /**
     * Toast 생성 & 표시 메서드
     */
    const toast = (
        type = 'noti',
        message = 'description',
        title = null,
        locked = false,
        option = {
            animation: true,
            autohide: true,
            delay: 3000,
        },
    ) => {
        const _tempToastObj = {
            type: type,
            locked: locked,
            title: title,
            message: message,
            option: option,
        };

        const _uuid = +new Date();
        const _instanceToast = <Toast key={_uuid} uuid={_uuid} {..._tempToastObj} />;

        const _tempToasts = toasts;
        const _keysToasts = Object.keys(toasts);
        if (_keysToasts.length > 2) {
            //표시된 Toast가 3개 이상일때
            delete _tempToasts[_keysToasts[_keysToasts.length - 1]];
        }

        setToasts({
            [_uuid]: _instanceToast,
            ..._tempToasts,
        });
    };

    useEffect(() => {
        const toastContainerEl = document.querySelector('.toast-container');
        var toastElList = [].slice.call(toastContainerEl.querySelectorAll('.hide'));

        const _tempToasts = toasts;
        toastElList.forEach((toastEl) => {
            delete _tempToasts[toastEl.id];
        });
        setToasts(_tempToasts);
    });

    useEffect(() => {
        /******************
         * Global Window variavle Override
         */
        window.toast = toast;
    }, []);

    return (
        <div aria-live="polite" aria-atomic="true" className="position-relative" style={{ zIndex: 99999 }}>
            <div className="toast-container position-fixed bottom-0 start-0 m-3">
                {_.map(toasts, (Toast, i) => {
                    return Toast;
                })}
            </div>
        </div>
    );
};

export default Toast_Container;
