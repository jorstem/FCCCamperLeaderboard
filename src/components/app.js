import React, { Component } from 'react';
import axios from 'axios';

import CamperList from './camper_list';

import MDSpinner from 'react-md-spinner';

export default class App extends Component {

  constructor(props){
      super(props);
      this.state={
        recentCampers: [] ,
        allTimeCampers: [],
        currentView: 'recentCampers'
      };
  }

componentWillMount() {
  //Make concurrent requests and set state to response
  axios.all([this.fetchRecentCampers(),this.fetchAllTimeCampers()])
    .then(axios.spread((recentCampers,allTimeCampers) => {
      this.setState({
        recentCampers: recentCampers.data,
        allTimeCampers: allTimeCampers.data
      });
        //ES6 Permet de seulement écrire recentCampers, allTimeCampers, si les paramètres sont identiques.
        //Dans le cas ici ils ne sont pas identiques pour bien comprendre quoi va où
        //Attention il faut faire le .data quand on utilise axios puisque axios retourne un object qui contient le data,
        //et pas le data directement...
        console.log(this.state);
    }));

}

fetchRecentCampers() {
  return axios.get('https://fcctop100.herokuapp.com/api/fccusers/top/recent');
}

fetchAllTimeCampers() {
  return axios.get('https://fcctop100.herokuapp.com/api/fccusers/top/alltime');
}

changeView(currentView){
  this.setState({currentView});
}

  render() {
    if(!this.state.recentCampers.length && !this.state.allTimeCampers.length){
      //return <div>Be patient..! We are loading your stuff...</div>
      return <MDSpinner className="spinner" size="100"/>;
    }

    return (
      <div>
        <h2>{`Viewing Top ${this.state.currentView}`}</h2>
        <button onClick={() => this.changeView('recentCampers')} className="btn btn-primary">Recent</button>
        <button onClick={() => this.changeView('allTimeCampers')} className="btn btn-primary">All Time</button>
        <CamperList campers={this.state[this.state.currentView]}/>
      </div>
    );
  }
}
