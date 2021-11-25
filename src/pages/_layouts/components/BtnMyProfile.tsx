import React from 'react';
import _ from 'lodash';
import cx from 'classnames';

import { useLanguages } from '@/hooks/useLanguages.hook';

const BtnMyProfile: React.FC<any> = (props): JSX.Element => {
    const { className, children, component } = props;
    const Lang = useLanguages();

    return (
        <div className="btn-group btn-group-sm" role="group">
            {component}
            <div className="btn-group btn-group-sm" role="group">
                <button
                    id="my_menu_dropdown"
                    type="button"
                    className={cx('btn dropdown-toggle loginWalletBtn')}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="fas fa-user-circle" /> {Lang.header_my_menu}
                </button>
                <ul className="dropdown-menu" aria-labelledby="btnGroupVerticalDrop1">
                    {children}
                    {/* {_.map(children, (el, key) => {
                        return (
                            <li key={key} className="dropdown-item">
                                {el}
                            </li>
                        );
                    })} */}
                </ul>
            </div>
        </div>
    );
};

export default BtnMyProfile;
