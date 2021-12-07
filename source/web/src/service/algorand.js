import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import WalletConnect from "@walletconnect/client";
const BRIDGE_URI = "https://bridge.walletconnect.org"

export const createConnector = () => {
    return new WalletConnect({
        bridge: BRIDGE_URI, // Required
        qrcodeModal: QRCodeModal,
    });
}

export const initSession = (onConnect, onSessionUpdate, onDisconnect, onSessionEnd) => {

    const connector = createConnector();
    if (!connector.connected) {
        connector.createSession();
        connector.on("connect", onConnect)
        connector.on("session_update", onSessionUpdate)
        connector.on("disconnect", onDisconnect)
    }
    else {
        connector.killSession().then(res => {
            // Session killed
            onSessionEnd(res)
        })
    }
    return connector
}