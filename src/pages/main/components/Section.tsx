import React from 'react';
import cx from 'classnames';

const Section: React.FC<any> = (props): JSX.Element => {
    const { className = 'my-4 py-4', children, width = '9' } = props;

    return (
        <div className={cx('row justify-content-center', className)}>
            <div className={`col-${width}`}>{children}</div>
        </div>
    );
};

export default Section;
