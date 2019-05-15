import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReduxStoreContext from '../context/redux-store'

class Provider extends Component {
  constructor(props) {
    super(props)
    const { store } = this.props
    this.state = store
    this.updateStore = this.updateStore.bind(this)
    this.unsubscribe = store.subscribe(this.updateStore)
  }
  updateStore() {
    const currentState = this.store.getState()
    this.setState(currentState)
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    return (
      <ReduxStoreContext.Provider value={this.state}>
        {this.props.children}
      </ReduxStoreContext.Provider>
    )
  }
}

Provider.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }),
  children: PropTypes.any
}

export default Provider