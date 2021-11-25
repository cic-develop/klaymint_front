/**
 * @title 공통함수 모음
 * @author pts and unknown
 * @date 210728
 * @version 1.0.0
 * @description true/false Check, String formatter
 */

export function is_true(value: string | number | boolean): boolean {
    if (value === undefined) return false;

    if (value == 'false') return false;
    if (value == 'true') return true;

    const numberedValue = Number(value);
    if (numberedValue === 0) {
        return false;
    } else {
        return true;
    }

    // return value;
}

export function is_trueNumString(value: string | number | boolean): string {
    if (value) {
        return '1';
    }

    return '0';
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: any, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

/**
 * @param nun string 핸드폰 번호 ('-' 제외)
 * @param hidden boolean 가운데 번호를 ****로 처리 여부
 * @returns string 핸드폰 번호 ('-' 포함)
 */
export function phoneDashFomatter(num: string, hidden = false) {
    let strDashNum = num;
    let pattern = '$1-$2-$3';
    if (hidden) pattern = '$1-****-$3';

    strDashNum = num
        .replace(/[^0-9]/g, '')
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, pattern)
        .replace('--', '-');

    return strDashNum;
}

/**
 * 숫자만 남기는 표현식 첫글자는 1~9만 허용
 * 010-2030-4050    ->  1020304050
 * @param strNumber string 핸드폰 번호 ('-' 제외)
 * @returns number 숫자
 */

export function replaceFirstNumbersNotZero(strNumber: string) {
    const res = strNumber.replace(/[^0-9]/g, '').replace(/(^0+)/, '');
    return Number(res);
}

/**
 * 1234567890  -> 1,234,567,890원
 * @param number 숫자
 * @param unit  단위
 * @returns string
 */
export function numberWithCommas(number: number, unit: string) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + unit;
}

export function floatWithCommas(number: number) {
    const parts = number.toString().split('.');
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
}

/**
 * 1234567890  -> 1,234,567,890원
 * @param number 숫자
 * @param unit  단위
 * @returns string
 */
export function numberToEng(number) {
    var inputNumber = number < 0.0 ? false : number;
    var unitWords = ['', ' K', ' M', ' B'];
    var splitUnit = 1000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = '';

    for (let index = 0; index < splitCount; index++) {
        let unitResult = (inputNumber % Math.pow(splitUnit, index + 1)) / Math.pow(splitUnit, index);

        unitResult = Math.floor(unitResult);

        if (unitResult > 0) {
            resultArray[index] = unitResult;
        }

        if (resultArray.length === 1) return String(inputNumber);
    }

    for (let i = 0; i < resultArray.length; i++) {
        if (!resultArray[i]) continue;
        resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }

    return resultString;
}

/**
 * 클립보드에 복사하기 핸들러
 * @param number 숫자
 * @param unit  단위
 * @returns string
 */
export function copyToClipboard(data: string): void {
    const t = document.createElement('textarea');
    document.body.appendChild(t);
    t.value = data;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
}

/**
 * 스크롤 최상위 이동 (애니메이션 효과)
 */
export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
