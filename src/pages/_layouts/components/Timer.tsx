import React, { useState, useEffect } from 'react';
import _ from 'lodash';
//import cx from 'classnames';

import { useLanguages } from '@/hooks/useLanguages.hook';

const Timer: React.FC<any> = (props): JSX.Element => {
    const { time, className, children, component } = props;
    const Lang = useLanguages();
    const [_time, setTime] = useState(time);

    useEffect(() => {
        if (_time <= 0) return;
        setTimeout(() => setTime(_time - 1), 1000);
    }, [_time]);

    const min = Math.floor(_time / 60);
    const sec = _time % 60;

    return <div className={className}>{`${Lang.word_expiration_time}  ${min} : ${sec}`}</div>;
};

export default Timer;
