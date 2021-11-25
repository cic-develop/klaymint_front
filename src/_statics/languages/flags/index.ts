import ko_KR from './kor.png';
import ja_JP from './jp.png';
import zh_CN from './ch.png';
import en_US from './usa.png';

type LanguageType = {
    [index: string]: Record<string, any>;
};

const obj: LanguageType = {
    'en-US': { code: 'EN', name: 'English', src: en_US },
    'ko-KR': { code: 'KO', name: '한국어', src: ko_KR },
    // 'ja-JP': { name: 'Japanse', src: ja_JP },
    // 'zh-CN': { name: 'Chinese', src: zh_CN },
};

export default obj;
