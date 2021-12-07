import './App.css';
import 'antd/dist/antd.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import {useEffect, useState} from "react";
import {Button, Spin} from "antd";
import './component/RenderTime.css'
import {RenderTime} from "./component/RenderTime";
import {backToGame, getUrlParameter} from "./utils/web";
import {initSession} from "./service/algorand";
import {linkWallet} from "./service/skyfab";

function App() {

  const [connected, setConnected] = useState(false);
  const [completed, setCompleted] = useState(false)
  const [address, setAddress] = useState()
  const [requestId, setRequestId] = useState()
  const [error, setError] = useState()
  const [connector, setConnector] = useState()

  useEffect(() => {
    const id = getUrlParameter('id');
    setRequestId(id);
  }, [])

  useEffect(() => {
    if(connected)
    {
      if(address)
      {
        linkPlayerWallet(address)
      }
      else {
        setError("Cannot connect to wallet, missing informations")
      }
    }
    else {
    }
  }, [connected, address])

  const connectWallet = () => {
    const walletConnector = initSession(onSessionConnect, onSessionUpdate, onDisconnect, onSessionEnd);
    setConnector(walletConnector)
  }
  const onSessionConnect = (error, payload) => {
    if (error) {
      throw error;
    }
    // Get updated accounts
    const { accounts } = payload.params[0];
    setAddress(accounts[0])
    setConnected(true)
  }

  const onSessionUpdate = (error, payload) => {
    if (error) {
      throw error;
    }
    // Get updated accounts
    const { accounts } = payload.params[0];
    setConnected(true)
    setAddress(accounts[0])
  }

  const onDisconnect = (error, payload) => {
    if (error) {
      throw error;
    }
    setConnected(false)
  }

  const onSessionEnd = (result) => {

  }

  const linkPlayerWallet = address => {
    linkWallet(address, requestId)
        .then(success => {

          setCompleted(true)

          setTimeout(() => {
            backToGame();
          },6000 )

        })
        .catch(error => {
          setError(error)
          console.log("error", error)
          // Display error, to user
        })
        .finally(_ => {
          connector.killSession()
        })
  };

  const openGame = () => {
    backToGame()
  }

  const render = () => {
    return (
        <div className="appContainer">

            {(!connected && !completed) &&
                <Button className={"center"}
                        type="primary"
                        size="large"
                        onClick={connectWallet}>
                  Connect to your Algorand Wallet
                </Button>
            }
          {connected && !completed &&
              <div>
                <div className={"notice"}>Processing process, please do not close your browser</div>
                <Spin />
              </div>
          }
            {completed && <div className={"notice"}>Connect wallet successfully, redirecting to game in</div>}
            {error && <div className={"error"}>{error}</div>}
            {completed &&
              <CountdownCircleTimer
                  isPlaying
                  duration={5}
                  colors={[
                    ['#004777', 0.33],
                    ['#F7B801', 0.33],
                    ['#A30000', 0.33],
                  ]}
              >
                {RenderTime}
              </CountdownCircleTimer>
            }

          {completed && <div style={{padding: "18px"}}>
            <Button className={"center"}
                    type="link"
                    size="large"
                    href={"skyvu://bbgo"}
                    >
              Back to game
            </Button>
          </div>}

        </div>
    );
  }
  return render();
}

export default App;
