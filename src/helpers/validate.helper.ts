/**
 * @title input Validate Check Functions
 * @author pts
 * @date 210728
 * @version 1.0.0
 * @return Error Message (String) 또는 null
 * @description react-hook-form의 input value 형식 체크를 위한 함수 집합
 */

/**
 * 빈값 허용함
 * input이 선택 항목일때 validate에 추가
 */
export function required(value: any): any {
    //return value ? null : '필수 항목입니다.';
    return value ? null : 'Required input.';
}

export const maxLength: any = (max: any) => (value: any) => {
    //return value && value.length > max ? max + '자 이하 입력해주세요.' : null;
    return value && value.length > max ? 'Enter ' + max + ' characters or less.' : null;
};

export const minLength: any = (min: any) => (value: any) => {
    //return value && value.length < min ? min + '자 이상 입력해주세요.' : null;
    return value && value.length < min ? 'Enter ' + min + ' or more characters' : null;
};

export function numOnly(value: any): any {
    const regExp = /[^0-9]/g;
    //return !regExp.test(value) ? null : '숫자만 입력 가능합니다.';
    return !regExp.test(value) ? null : 'Enter only numbers';
}

export function numOnlyTwoDecimal(value: any): any {
    const regExp = /^\d*(\.\d{0,2})?$/;
    //return !regExp.test(value) ? null : '숫자만 입력 가능합니다.';
    return regExp.test(value) ? null : 'Enter only numbers';
}

/**
 * 이메일 체크
 */
export function email(value: any): any {
    //return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Email 형식이 아닙니다.' : null;
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Email format is incorrect' : null;
}

/**
 * 비밀번호 체크
 * GS인증 포멧
 * -- 조건
 * 1. 알파벳, 숫자, 특수문자( ~!@#$%^&'*_+?- )를 포함 9~24자여야 합니다.
 * 2. 비밀번호는 이메일 또는 아이디와 같을 수 없습니다.
 * 3. 비밀번호는 입력하지 않아도 됩니다.
 */
export function password_gs(value: any): any {
    if (value === null || value === '') return null;
    const regExp = /(?=.*\d)(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~!@#$%^&'*_+?\\-]).{9,24}/;

    return regExp.test(value) ? null : "알파벳, 숫자, 특수문자( ~!@#$%^&'*_+?- )를 포함 9~24자여야 합니다.";
}

/**
 * 대소문자, 숫자 조합 패턴
 */
export function alphabet_number_pattern(value: any): any {
    const regExp = /(?=.*\d)(?=.*[0-9])|(?=.*[a-zA-Z])/;

    return regExp.test(value) ? null : '알파벳, 숫자를 포함해야 합니다.';
}

/**
 * 대소문자, 숫자 포함 6 ~ 12
 */
export function password_pattern_1(value: any): any {
    const regExp = /(?=.*\d)(?=.*[0-9])(?=.*[a-zA-Z]).{6,12}/;

    return regExp.test(value) ? null : '알파벳, 숫자를 포함한 6~12자여야 합니다.';
}

export const compare_password: any = (target: any) => (source: any) => {
    return source === target ? null : '비밀번호가 정확하지 않습니다.';
};

/**
 * IP 포멧 체크 (와일드 카드 사용 가능)
 * 사용 가능 문자 *, 1-0
 * ex) '*' , "*.*.*.*", 192.168.*.1, 1.*.123.123.* 등
 */
export function ip(value: any): any {
    const regExp =
        /^(((([*]|[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([*]|[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1})|[*]{1})$/;

    return regExp.test(value) ? null : "ex) '*', '*.*.*.*', '192.168.0.*', '192.168.0.100'";
}

export function IPorURL(value: any): any {
    const ip_regExp =
        /^(((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}))$/;
    const url_regExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (ip_regExp.test(value) || url_regExp.test(value)) {
        return null;
    } else {
        return "ex) '192.168.0.1', 'http://www.abc.com'";
    }
}
export function accessMode(value: any): any {
    const regExp = /^[0-7]{3}$/;
    return regExp.test(value) ? null : '000 ~ 777';
}

export const integerLength: any = (min: any, max: any) => (value: any) => {
    //조건에 부합
    if (min <= value && value <= max) return null;

    return `${min} ~ ${max}`;
};

/**
 * 핸드폰번호 체크
 * 010-1234-0987
 * 01012340987   2종류를 모두 체크
 * 핸드폰번호는 입력하지 않아도 됩니다.
 */
export function phone(value: any) {
    if (value === null || value === '') return null;
    const regExp0 = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
    const regExp1 = /(01[016789])[-]([1-9]{1}[0-9]{2,3})[-]([0-9]{4})$/;

    if (regExp0.test(value)) return null;
    if (regExp1.test(value)) return null;

    if (!value || value == '') {
        return null;
    }

    return '01XxxxxXXXX or 01X-XXXX-XXXX';
}

export function phone0(value: any) {
    if (value === null || value === '') return null;
    const regExp0 = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
    const regExp1 = /(01[016789])[-]([1-9]{1}[0-9]{2,3})[-]([0-9]{4})$/;

    if (regExp0.test(value)) return null;
    if (regExp1.test(value)) return null;

    if (!value || value == '') {
        return null;
    }

    return '01XxxxxXXXX or 01X-XXXX-XXXX';
}

/**
 * 이메일 중복 체크
 * example :: requestEmailCheck("POST", "/accounts/findEmail", null)
 */

// export const requestEmailCheck = (method, address, header) => async (value) => {
//     let msg = email(value);
//     if (msg !== null) return msg;

//     msg = required(value);
//     if (msg !== null) return msg;
//     const result = await request(method, address, header, { email: value });

//     if (result && result.data && result.data.successful) {
//         if (result.data.data > 0) {
//             return "중복된 이메일입니다.";
//         }
//         return null;
//     }
// };
