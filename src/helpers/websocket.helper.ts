/**
 * @title WebSocket용 Model (typescript)
 * @author pts
 * @date 211124
 * @version 1.0.0
 * @description 웹 소켓 모델
 */

import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class WebSocketModel {
    // const variable
    private readonly SERVER_ADDR: string = window.envBackWebSocketHost;

    // variables
    private ws: WebSocket;
    private _user: Navigator;

    constructor() {
        //super();
        this.initialize();
    }

    //Member Methods
    public initialize = () => {
        this.ws = new WebSocket(this.SERVER_ADDR);
        this._user = window.navigator;

        //registed EventHandler
        this.ws.onopen = this._handleOpen;
        this.ws.onclose = this._handleClose;
        this.ws.onerror = this._handleError;
        this.ws.onmessage = this._handleMessage;

        // registed Custom EventHandler
        console.log('*** Ready to WebSocket ***');
        // console.log(this.ws.CONNECTING); // 0
        // console.log(this.ws.OPEN);       // 1
        // console.log(this.ws.CLOSING);    // 2
        // console.log(this.ws.CLOSED);     // 3
    };

    //getter
    public getWebSocket = () => this.ws;
    public user = () => this._user;
    public state = () => this.ws.readyState;

    public sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
        if (this.ws.readyState !== this.ws.OPEN) {
            console.log('** WebSocket is not Open **');
            new Error('** WebSocket is Close **');
            return;
        }
        this.ws.send(data);
    };

    private _handleOpen = (e: Event) => {
        console.log('Connected WebSocket >>', this.SERVER_ADDR);
    };
    private _handleClose = (e: CloseEvent) => {
        console.log('Closed WebSocket >>', this.SERVER_ADDR);
    };
    private _handleError = (err: Event) => {
        console.log('Error WebSocket >>');
    };
    private _handleMessage = (wssMsg: MessageEvent<any>) => {
        console.log('Received Message >>', wssMsg);
    };
}

export default new WebSocketModel();
