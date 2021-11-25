/**
 * @title Axios Instance
 * @author pts
 * @date 210728
 * @version 1.0.0
 * @description 비동기 요청 처리를위한 클래스 new를 이용하여 객체 생성후 사용
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';

type callback = <T>(data?: any | null) => T | void;

interface requestCallBack {
    onComplete?: callback;
    onError?: callback;
    onFinally?: callback;
}

export default class Instance {
    constructor() {}

    //Defalut options
    axiosOptions: AxiosRequestConfig = {
        /**
         * `url`은 요청에 사용될 서버 URL입니다.
         */
        url: '/',

        /**
         * `method`는 요청을 할 때 사용될 메소드 이름입니다.
         */
        method: 'POST', // default

        /**
         * `url` 속성 값이 절대 URL이 아니라면, `url` 앞에 `baseURL`이 붙습니다.
         * axios 인스턴스가 상대 URL을 해당 인스턴스의 메소드에 전달하도록
         * `baseURL`을 설정하는 것이 편리 할 수 있습니다.
         */

        baseURL: window.envBackHost,

        // `transformRequest`는 서버에 보내기 전에 요청 데이터를 변경할 수 있습니다.
        // 요청 메소드 'PUT', 'POST' 및 'PATCH' 에만 적용 가능합니다.
        // 배열의 마지막 함수는 버퍼(buffer)의 문자열이나 인스턴스를 반환해야 합니다.
        // ArrayBuffer, FormData 또는 Stream 헤더 객체를 수정할 수 있습니다.
        // transformRequest: [
        //     function (data, headers) {
        //         // 데이터 변환 수행 후, 반환
        // ...
        //         return data;
        //     },
        // ],

        // `transformResponse` allows changes to the response data to be made before
        // it is passed to then/catch
        // transformResponse: [
        //     function (data) {
        //         // Do whatever you want to transform the data

        //         return data;
        //     },
        // ],

        // `headers` are custom headers to be sent

        headers: {}, // { "rs-access-token": "" },

        // `params` are the URL parameters to be sent with the request
        // Must be a plain object or a URLSearchParams object
        // params: {
        //     ID: 12345,
        // },

        // `paramsSerializer` is an optional function in charge of serializing `params`
        // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
        // paramsSerializer: function (params) {
        //     return Qs.stringify(params, { arrayFormat: "brackets" });
        // },

        // `data` is the data to be sent as the request body
        // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
        // When no `transformRequest` is set, must be of one of the following types:
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - Browser only: FormData, File, Blob
        // - Node only: Stream, Buffer
        data: {},

        // syntax alternative to send data into the body
        // method post
        // only the value is sent, not the key
        //data: "Country=Brasil&City=Belo Horizonte",

        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        //timeout: 00000, // default is `0` (no timeout)

        // `withCredentials` indicates whether or not cross-site Access-Control requests
        // should be made using credentials
        withCredentials: true, // default

        // `adapter` allows custom handling of requests which makes testing easier.
        // Return a promise and supply a valid response (see lib/adapters/README.md).
        // adapter: function (config) {
        //     /* ... */
        // },

        // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
        // This will set an `Authorization` header, overwriting any existing
        // `Authorization` custom headers you have set using `headers`.
        // Please note that only HTTP Basic auth is configurable through this parameter.
        // For Bearer tokens and such, use `Authorization` custom headers instead.
        // auth: {
        //     username: "janedoe",
        //     password: "s00pers3cret",
        // },

        // `responseType` indicates the type of data that the server will respond with
        // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //   browser only: 'blob'
        responseType: 'json', // default

        // `responseEncoding` indicates encoding to use for decoding responses (Node.js only)
        // Note: Ignored for `responseType` of 'stream' or client-side requests

        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        //xsrfCookieName: "XSRF-TOKEN", // default

        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        //xsrfHeaderName: "X-XSRF-TOKEN", // default

        // `onUploadProgress` allows handling of progress events for uploads
        // browser only
        onUploadProgress: function (progressEvent: any) {
            // Do whatever you want with the native progress event
        },

        // `onDownloadProgress` allows handling of progress events for downloads
        // browser only
        onDownloadProgress: function (progressEvent: any) {
            // Do whatever you want with the native progress event
        },

        // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
        //maxContentLength: 2000,

        // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
        //maxBodyLength: 2000,

        // `validateStatus` defines whether to resolve or reject the promise for a given
        // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
        // or `undefined`), the promise will be resolved; otherwise, the promise will be
        // rejected.
        validateStatus: function (status) {
            //return status >= 200 && status < 400; // default
            return true; // default
        },

        // `maxRedirects` defines the maximum number of redirects to follow in node.js.
        // If set to 0, no redirects will be followed.
        maxRedirects: 5, // default

        // `socketPath` defines a UNIX Socket to be used in node.js.
        // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
        // Only either `socketPath` or `proxy` can be specified.
        // If both are specified, `socketPath` is used.
        socketPath: null, // default

        // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
        // and https requests, respectively, in node.js. This allows options to be added like
        // `keepAlive` that are not enabled by default.
        // httpAgent: new http.Agent({ keepAlive: true }),
        // httpsAgent: new https.Agent({ keepAlive: true }),

        // `proxy` defines the hostname and port of the proxy server.
        // You can also define your proxy using the conventional `http_proxy` and
        // `https_proxy` environment variables. If you are using environment variables
        // for your proxy configuration, you can also define a `no_proxy` environment
        // variable as a comma-separated list of domains that should not be proxied.
        // Use `false` to disable proxies, ignoring environment variables.
        // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
        // supplies credentials.
        // This will set an `Proxy-Authorization` header, overwriting any existing
        // `Proxy-Authorization` custom headers you have set using `headers`.
        // proxy: {
        //     host: "127.0.0.1",
        //     port: 9000,
        //     auth: {
        //         username: "mikeymike",
        //         password: "rapunz3l",
        //     },
        // },

        // `cancelToken` specifies a cancel token that can be used to cancel the request
        // (see Cancellation section below for details)
        //cancelToken: new CancelToken(function (cancel) {}),

        // `decompress` indicates whether or not the response body should be decompressed
        // automatically. If set to `true` will also remove the 'content-encoding' header
        // from the responses objects of all decompressed responses
        // - Node only (XHR cannot turn off decompression)
        decompress: true, // default
    };

    options = _.cloneDeep(this.axiosOptions);
    _res: any = null;

    setOptions = (_options: AxiosRequestConfig = this.axiosOptions) => {
        this.options = { ...this.options, ..._options };
    };

    // appand_AToken = () => {
    //     this.options.headers['Authorization'] = 'Bearer ' + window?.localStorage['rs-a-token'];
    // };
    // appand_RToken = () => {
    //     this.options.headers['Authorization'] = 'Bearer ' + window?.localStorage['rs-r-token'];
    // };

    // reissue = async () => {
    //     this.appand_RToken();
    //     this.setOptions({
    //         url: '',
    //         method: 'POST',
    //     });
    //     const res = await this.request({
    //         onComplete: (res: any) => {
    //             console.log(res, 'reissue Complete');
    //         },
    //         onError: (err: any) => {
    //             console.log(err, 'reissue Error');
    //         },
    //         onFinally: () => {
    //             console.log('reissue Finally');
    //         },
    //     });
    //     //sessionStorage.setItem("rs-a-token", "sssss");
    // };

    request = async ({ onComplete, onError, onFinally }: requestCallBack): Promise<any> => {
        let __res = null;
        const start = axios.create();
        this._res = await start(this.options)
            .then(async (res: AxiosResponse<any>) => {
                switch (res?.status) {
                    case 200:
                    case 201:
                        onComplete && onComplete(res);
                        __res = res;
                        break;
                    case 400:
                    case 401:
                        //await this.reissue();
                        onError && onError(res);
                        __res = res;
                        break;
                    case 500:
                        onError && onError(res);
                        __res = res;
                        break;
                }
            })
            .catch((err) => {
                onError && onError(err);
                __res = err;
            })
            .finally(() => {
                onFinally && onFinally(null);
            });
        return __res;
    };
}
