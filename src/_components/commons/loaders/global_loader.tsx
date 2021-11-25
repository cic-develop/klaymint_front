import React, { useState, useEffect } from 'react';
import css from './global_loader.module.scss';

declare global {
    interface Window {
        loader?: any;
    }
}

const global_loader: React.FC<any> = (props): JSX.Element => {
    const [toggle, setToggle] = useState<boolean>(false);

    useEffect(() => {
        /******************
         * Global Window variavle Override
         */
        window.loader = loader;
    }, []);

    const loader = (_toggle) => setToggle(_toggle);

    return (
        <div className={css.bg} style={{ display: toggle ? 'block' : 'none' }}>
            {/* <!-- Loading square for squar.red network --> */}
            <span className={css.loader}>
                <span className={css.loader_inner}></span>
            </span>
        </div>
    );
};

export default global_loader;
