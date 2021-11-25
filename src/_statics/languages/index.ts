import ko_KR from './ko_KR';
// import ja_JP from './jp.png';
// import zh_CN from './ch.png';
import en_US from './en_US';

type LanguageType = {
    [index: string]: Record<string, any>;
};

const obj: LanguageType = {
    'ko-KR': ko_KR,
    // 'ja-JP': ja_JP,
    // 'zh-CN': zh_CN,
    'en-US': en_US,
};

export default obj;
