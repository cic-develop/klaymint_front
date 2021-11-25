import languagePack from '@/_statics/languages';

import TermOfUse_KO from '@/_statics/languages/ko_KR_termOfService';
import TermOfUse_EN from '@/_statics/languages/en_US_termOfService';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

const useLanguages = (): Record<string, any> => {
    const { language } = useSelector((store: RootState) => store.GlobalStatus);

    return languagePack[language] ?? languagePack[navigator.language];
};

export { useLanguages };
