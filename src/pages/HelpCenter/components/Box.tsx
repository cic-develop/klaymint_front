import React from 'react';
import cx from 'classnames';
import css from '../helpCenter.module.scss';

const Box: React.FC<any> = (props): JSX.Element => {
    const { title = '', children, className } = props;

    return (
        <div className={cx('card border-0', className, css.box)}>
            <div className="card-body">{children}</div>
        </div>
    );
};

export default Box;
