import React from 'react'
import WalletRestore from './WalletRestore'
import WalletSelectUi from './WalletSelectUi'
import WalletCreate from './WalletCreate'
import { Route, Switch, useHistory } from 'react-router-dom'

const WalletSetup = ({match}) => {

  const history = useHistory()

  const restoreWalletBtnClicked = () => {
    history.push('/setup/restore')
  }

  const createWalletBtnClicked = () => {
    history.push('/setup/create')
  }

  return (
      <div id="walletSetupContent">
        <Switch>
          <Route exact path={match.url}>
            <div id="setupContainer" className='container mx-auto' style={{maxWidth: "700px", height: "100vh"}}>
              <div className='d-flex flex-column justify-content-center h-100'>
                <button className='btn btn-lg btn-primary' type="button" onClick={createWalletBtnClicked}>Create New Wallet</button>
                <button className='btn btn-lg btn-primary mt-3' type="button" onClick={restoreWalletBtnClicked}>Restore Wallet</button>
              </div>
            </div>
          </Route>
          <Route exact path={`${match.url}/create`} component={WalletCreate} />
          <Route exact path={`${match.url}/restore`} component={WalletRestore} />
          <Route exact path={`${match.url}/selectui`} component={WalletSelectUi} />
        </Switch>
      </div>
  )
}

export default WalletSetup
