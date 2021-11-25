const GMAIL_SERVICE_NAME = "gmail";
// const GMAIL_SERVICE_HOST = smtp.gmail.com;
const GMAIL_SERVICE_SECURE = false;
const GMAIL_SERVICE_PORT = 587;
const GMAIL_USER_NAME = "corp@rs-team.com";
const GMAIL_USER_PASSWORD = "rs00mk@@";
const PASSWORD_FIND_TITLE = "비밀번호 변경 안내";
const PASSWORD_FIND_HTML = `
    <html dir="ltr" lang="ko" class="">
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <h2>비밀번호 변경 안내</h2>
            <div>
                <h4>비밀번호가 변경되었습니다.</h4>
                <p>변경된 비밀번호는 <strong> $password </strong> 입니다.</p>
                <p>변경된 비밀번호로 로그인 후, 비밀번호를 변경 바랍니다.</p>
            </div>
        </body>
    </html>
`;

module.exports = {
    GMAIL_SERVICE_NAME,
    GMAIL_SERVICE_SECURE,
    GMAIL_SERVICE_PORT,
    GMAIL_USER_NAME,
    GMAIL_USER_PASSWORD,
    PASSWORD_FIND_TITLE,
    PASSWORD_FIND_HTML,
};
