import React from 'react';
import cx from 'classnames';

declare interface ModalParams {
    id: string;
    className?: string;
    children?: JSX.Element | string | null;
    closeHold?: boolean;
    fullscreen?: boolean;
    dClassName?: string;
    onClick?: any;
}

const remoteCollapseOpener = (id: string) => {
    const _instanceBtn = document.createElement('button');
    document.body.appendChild(_instanceBtn);
    _instanceBtn.setAttribute('type', 'button');
    _instanceBtn.setAttribute('data-bs-toggle', 'collapse');
    _instanceBtn.setAttribute('data-bs-target', '#' + id);
    _instanceBtn.click();
    document.body.removeChild(_instanceBtn);
};

const remoteModalOpener = (id: string) => {
    const _instanceBtn = document.createElement('button');
    document.body.appendChild(_instanceBtn);
    _instanceBtn.setAttribute('type', 'button');
    _instanceBtn.setAttribute('data-bs-toggle', 'modal');
    _instanceBtn.setAttribute('data-bs-target', '#' + id);
    _instanceBtn.click();
    document.body.removeChild(_instanceBtn);
};

const ModalButton: React.FC<any> = (props: ModalParams): JSX.Element => {
    const { children, id, className, onClick } = props;

    return (
        <button className={className} type="button" data-bs-toggle="modal" data-bs-target={`#${id}`} onClick={onClick}>
            {children}
        </button>
    );
};

const Modal: React.FC<any> = (props: ModalParams): JSX.Element => {
    const { children, id, className, closeHold, dClassName } = props;

    return (
        <div
            className={cx('modal', className ?? className, 'fade')}
            id={id}
            tabIndex={-1}
            aria-labelledby={`${id}_area`}
            aria-hidden="true"
            data-bs-backdrop={closeHold ? 'static' : 'true'}
            data-bs-keyboard={closeHold ? 'false' : 'true'}
            role="dialog"
        >
            <div className={cx('modal-dialog modal-dialog-centered', dClassName)}>
                {/* chilren Example */}
                <div className={cx('walletModalSection', 'modal-content')}>{children}</div>
            </div>
        </div>
    );
};

export { Modal, ModalButton, remoteModalOpener, remoteCollapseOpener };
