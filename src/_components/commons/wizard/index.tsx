import React, { useState, useCallback, useEffect } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import './stepWizard.css';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import { useLanguages } from '@/hooks/useLanguages.hook';

type CALLBACK = (data?: any | null) => any;

declare interface WizardParams {
    id: string;
    className?: string;
    children?: JSX.Element | string | null;
    closeHold?: boolean;
    fullscreen?: boolean;
    dClassName?: string;
    onClick?: any;
    title?: any;
    lock?: boolean;
}

declare interface StepWizardParams {
    id: string;
    className?: string;
    children?: JSX.Element;
    closeHold?: boolean;
    fullscreen?: boolean;
    dClassName?: string;
    onClick?: any;
    title?: any;
    onNext?: CALLBACK;
    onPrev?: CALLBACK;
    onConfirm?: CALLBACK;
    handleReset: CALLBACK;
}

const remoteWizardOpener = (id: string) => {
    const _instanceBtn = document.createElement('button');
    document.body.appendChild(_instanceBtn);
    _instanceBtn.setAttribute('type', 'button');
    _instanceBtn.setAttribute('data-bs-toggle', 'modal');
    _instanceBtn.setAttribute('data-bs-target', '#' + id);
    _instanceBtn.click();
    document.body.removeChild(_instanceBtn);

    const _backlayer = document.getElementsByClassName('modal-backdrop');
    if (_.size(_backlayer) > 0) {
        _.forEach(_backlayer, (el, i) => {
            el.remove();
        });
    }
};

const WizardButton: React.FC<any> = (props: WizardParams): JSX.Element => {
    const { children, id, className, onClick } = props;

    return (
        <button className={className} type="button" data-bs-toggle="modal" data-bs-target={`#${id}`} onClick={onClick}>
            {children}
        </button>
    );
};

const Wizard: React.FC<any> = (props: WizardParams): JSX.Element => {
    const wallet = useSelector((store: RootState) => store.Wallet);
    const { children, id, className, closeHold, dClassName, title, lock } = props;

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
            style={{ zIndex: 999999 }}
        >
            <div className={cx('modal-dialog modal-dialog-centered', dClassName)}>
                {/* chilren Example */}
                <div className={'modal-content modalBodyContainer'}>
                    <div className="d-flex justify-content-between m-3">
                        <h5 className="mx-2 text-dark">{title}</h5>
                        {/* [X] 버튼 */}
                        {(!lock || wallet.type === 'klip') && (
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        )}
                    </div>
                    <div className="modal-body p-0 m-0">{children}</div>
                </div>
            </div>
        </div>
    );
};

const StepWizard: React.FC<any> = (props: StepWizardParams): JSX.Element => {
    const [step, setStep] = useState<number>(0);
    const [lock, setLock] = useState<boolean>(false);
    const Lang = useLanguages();

    const stepLength = _.size(props.children);

    useEffect(() => {
        const thisStepWizard = document.getElementById(props.id);

        const _reset = () => {
            setStep(0);
            setLock(false);
        };

        thisStepWizard.addEventListener('hidden.bs.modal', _reset, true);
        return () => thisStepWizard.removeEventListener('hidden.bs.modal', _reset, true);
    }, []);

    /**
     * 다음 스탭 핸들러
     */
    const _nextHandler = useCallback(async () => {
        setLock(true);
        if (props.onNext) await props.onNext();

        const childrenOnNext = props.children[step]?.props['data-fn-next']
            ? props.children[step].props['data-fn-next']
            : () => false;

        const res = await childrenOnNext();

        if (!res) {
            await setStep(0);
            await setLock(false);
            remoteWizardOpener(props.id);
            return;
        }

        await setStep(res ? step + 1 : -1);
        await setLock(false);
    }, [step]);

    /**
     * 마지막 완료 핸들러
     */
    const _confirmHandler = useCallback(async () => {
        setLock(true);
        if (props.onConfirm) await props.onConfirm();

        const childrenOnConfirm = props.children[step]?.props['data-fn-confirm']
            ? props.children[step].props['data-fn-confirm']
            : () => false;

        const res = await childrenOnConfirm();

        if (res) {
            console.log('end');
            await setStep(0);
            await setLock(false);
            remoteWizardOpener(props.id);
        }
    }, [step, lock]);

    return (
        <Wizard {...props} lock={lock} title={props.children[step]?.props['data-step-title']}>
            {step >= 0 && props.children[step]}
            {step < 0 && <div>Error</div>}

            <div className="position-bottom bg-dark p-0 text-center">
                {step < 0 ? (
                    <button
                        className="btn m-0 p-3"
                        onClick={() => {
                            setStep(0);
                            setLock(false);
                            remoteWizardOpener(props.id);
                        }}
                    >
                        error
                    </button>
                ) : (
                    <button
                        disabled={lock}
                        className="btn m-0 p-3"
                        onClick={stepLength - 1 > step ? _nextHandler : _confirmHandler}
                    >
                        {lock ? (
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : stepLength - 1 > step ? (
                            <div>
                                Next <i className="fas fa-chevron-right" />
                            </div>
                        ) : (
                            <div>{props.children[step]?.props['data-step-title']}</div>
                        )}
                    </button>
                )}
            </div>
        </Wizard>
    );
};

export { Wizard, StepWizard, WizardButton, remoteWizardOpener };
