import React, { Component } from 'react';

export default class HomeView extends Component {
  handleAddClick = () => {

  }

  render () {
    return (
      <div className="mw-500">
        <p>Hi!</p>
        <p className="mt-2">
          <strong>Poketo</strong> is a friendly manga tracker for following series you like.
        </p>
        <p className="mt-2">
          To get started,{' '}
          <button className="Link" onClick={this.handleAddClick}>
            add a series
          </button>.
        </p>
      </div>
    );
  }
}
