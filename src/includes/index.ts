/**
 * import Bootstrap 5 library
 */
import '@/_statics/bootstrap-5.1.2/css/bootstrap.min.css';
import '@/_statics/bootstrap-5.1.2/js/bootstrap.bundle.min.js';
import '@/_statics/fontawesome-free-5.15.4-web/css/all.css';

/**
 * import Image Slide Library
 */
import '@/_statics/splidejs3.0.9/css/themes/splide-skyblue.min.css';

/**
 * import Global CSS3
 * scss는 변수 형태로 컴포넌트에 import하여 사용해야하기 떄문에 특정 스타일이나 클래스에 대하여
 * 전역적으로 패시브하게 적용할수 없다.
 * 따라서 CSS 형태의 global.css를 생성
 */

import '@/_statics/styles/global.css';

import './console';
import './envVariables';
import './caver';
// import './bubble';

/******************
 * Global Window variavle Override
 * ./_components/commons/toasts/Toast_bs5.tsx line:140 에 정의 되어있음
 */
//window?.toast = toast;

/******************
 * Global Window variavle Override
 * ./_components/commons/loader/global_loader.tsx line:12 에 정의 되어있음
 */
//window.loader = loader;
