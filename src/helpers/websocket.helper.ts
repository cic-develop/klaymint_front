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
    private user: Navigator;

    constructor() {
        //super();
        this.initialize();
    }

    //Member Methods
    public initialize = () => {
        this.ws = new WebSocket(this.SERVER_ADDR);
        this.user = window.navigator;

        //registed EventHandler
        this.ws.onopen = this._handleOpen;
        this.ws.onclose = this._handleClose;
        this.ws.onerror = this._handleError;
        this.ws.onmessage = this._handleMessage;

        // registed Custom EventHandler
        console.log('*** Ready to WebSocket ***');
    };

    public getWebSocket = () => this.ws;
    public getUser = () => this.user;

    public sendMessage = (data) => this.ws.send(data);

    private _handleOpen = () => {
        console.log('Connected WebSocket >>', this.SERVER_ADDR);
    };
    private _handleClose = () => {
        console.log('Closed WebSocket >>', this.SERVER_ADDR);
    };
    private _handleError = () => {};
    private _handleMessage = () => {};
}

export default new WebSocketModel();
