import React from 'react';
import cx from 'classnames';
import classNames from 'classnames';

declare interface CollapseParams {
    id: string;
    children?: JSX.Element | string | null;
    className?: string;
}

const CollapseButton: React.FC<any> = (props: CollapseParams): JSX.Element => {
    const { children, id, className } = props;

    return (
        <div
            className={cx('collapsed', className)}
            data-bs-toggle="collapse"
            data-bs-target={`#${id}`}
            aria-expanded="false"
            aria-controls={id}
        >
            {children}
        </div>
    );
};

const CollapseArea: React.FC<any> = (props: CollapseParams): JSX.Element => {
    const { children, id, className } = props;

    return (
        <div className={cx('collapse', className)} id={id}>
            {children}
        </div>
    );
};

export { CollapseButton, CollapseArea };
