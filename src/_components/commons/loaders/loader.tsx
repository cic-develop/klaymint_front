import React from 'react';
import cx from 'classnames';

declare global {
    interface Window {
        loader?: any;
    }
}

const Loader: React.FC<any> = (props): JSX.Element => {
    const { className } = props;

    return (
        <div className="d-flex justify-content-center p-5">
            <div className={cx('spinner-border', className)} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
