import React, { useState } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import css from '../helpCenter.module.scss';

const QnAItem: React.FC<any> = (props): JSX.Element => {
    const { puuid, uuid, question = 'Question', children } = props;
    const [open, setOpen] = useState(false);

    return (
        <div className={cx('card card-body border-0 m-3 p-0', css.qna_item)}>
            <button
                className="p-3 border-0 text-start"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={'#' + uuid}
                aria-expanded="false"
                aria-controls={uuid}
                onClick={() => setOpen(!open)}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <b>{question}</b>
                    {open ? <i className="fas fa-chevron-up" /> : <i className="fas fa-chevron-down" />}
                </div>
            </button>
            <div className="collapse p-3 text-start" id={uuid}>
                {/* <div className="col-12 pb-3"> */}
                {children}
                {/* </div> */}
            </div>
        </div>
    );
};

export { QnAItem };
