import React from 'react';
import cx from 'classnames';

import css from './../_layout.module.scss';
import { scrollToTop } from '@/helpers/common.helper';

import snsDown01 from '@/_statics/images/f-sns01.png';
import snsDown03 from '@/_statics/images/f-sns03.png';
import snsDown04 from '@/_statics/images/f-sns04.png';

const RightArea: React.FC<any> = (): JSX.Element => {
    return (
        <>
            {/* <div className="position-fixed bottom-50 end-0 mx-3" style={{ zIndex: 999 }}>
                <ul></ul>
            </div> */}
            <div className="position-fixed bottom-0 end-0 mx-3">
                <ul className="p-0">
                    <li>
                        <a href="https://twitter.com/klaymint" target="_blank" title="Twitter">
                            <img className={cx('shadow', css.thumb, 'shadow my-2 rounded-circle')} src={snsDown03} />
                        </a>
                    </li>
                    <li className="mb-1">
                        <a href="https://t.me/KLAYMINTOFFICIAL" target="_blank" title="Telegram">
                            <img className={cx(css.thumb, 'shadow my-2 rounded-circle')} src={snsDown04} />
                        </a>
                    </li>
                    <li className="mb-1">
                        <a href="https://klaymint.medium.com/" target="_blank" title="Telegram">
                            <img className={cx(css.thumb, 'shadow my-2 rounded-circle')} src={snsDown01} />
                        </a>
                    </li>
                    <li>
                        <a className="shadow my-2 rounded-circle" title="Top" onClick={() => scrollToTop()}>
                            <i className={cx(css.top_btn, 'fas fa-arrow-alt-circle-up')} />
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default RightArea;
