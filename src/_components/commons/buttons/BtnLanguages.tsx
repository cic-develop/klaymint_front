import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import flags from '@/_statics/languages/flags';

import { RootState } from '@/redux/connectors.redux';
import { keyNameLanguage, setLanguage } from '@/redux/reducers/GlobalStatus.reducer';

const BtnIconLanguages: React.FC<any> = (props): JSX.Element => {
    const { className } = props;

    const dispatch = useDispatch();
    const { language } = useSelector((store: RootState) => store.GlobalStatus);

    const [_langugae, _setLanguage] = useState<string>(language);

    const changeHandler = (strLanguage: string) => {
        _setLanguage(strLanguage);
        dispatch(setLanguage(strLanguage));
    };

    return (
        <div className="btn-group btn-group-link" role="group">
            <button
                id="language_flags"
                type="button"
                className={cx('btn btn-link btn-sm connectWalletButton', className)}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <img
                    style={{ border: 'none' }}
                    className="img-thumanil rounded-circle border-2 border-secondary"
                    src={flags[_langugae].src}
                    width="24px"
                    height="24px"
                />
            </button>
            <ul className="dropdown-menu" aria-labelledby="BtnLanguage">
                {_.map(flags, (el, key) => {
                    return (
                        <li key={key}>
                            <button type="button" className="dropdown-item" onClick={() => changeHandler(key)}>
                                <img src={el.src} width="32px" /> {el.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const BtnStrLanguages: React.FC<any> = (props): JSX.Element => {
    const { className } = props;

    const dispatch = useDispatch();
    const { language } = useSelector((store: RootState) => store.GlobalStatus);

    const [_langugae, _setLanguage] = useState<string>(language);

    const changeHandler = (strLanguage: string) => {
        _setLanguage(strLanguage);
        dispatch(setLanguage(strLanguage));
    };

    return (
        <div className="btn-group btn-group-link" role="group">
            <button
                id="language_flags"
                type="button"
                className={cx('btn connectWalletButton text-white', className)}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <b>{flags[_langugae].code}</b>{' '}
                <small>
                    <i className="fas fa-chevron-down mx-2" />
                </small>
            </button>
            <div
                className="dropdown-menu dropdown-menu-end bg-dark border-1 border-white"
                aria-labelledby="BtnLanguage"
            >
                {_.map(flags, (el, key) => {
                    return (
                        <button
                            key={key}
                            type="button"
                            className="dropdown-item text-white"
                            onClick={() => changeHandler(key)}
                        >
                            <b>{el.code}</b> <span className="mx-3">{el.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export { BtnIconLanguages, BtnStrLanguages };
