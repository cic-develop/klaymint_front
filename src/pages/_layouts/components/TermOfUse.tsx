import React, { useEffect } from 'react';

import TermOfUse_KO from '@/_statics/languages/ko_KR_termOfService';
import TermOfUse_EN from '@/_statics/languages/en_US_termOfService';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

const LangTermOfUse: React.FC<any> = (): JSX.Element => {
    const { language } = useSelector((store: RootState) => store.GlobalStatus);

    const obj = {
        'en-US': <TermOfUse_EN />,
        'ko-KR': <TermOfUse_KO />,
        // 'ja-JP': ja_JP,
        // 'zh-CN': zh_CN,
    };

    return <>{obj[language] ?? obj[navigator.language]}</>;
};

export default LangTermOfUse;
