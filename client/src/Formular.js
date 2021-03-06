import React, { Component } from "react";
import axios from "axios";


class Formular extends React.Component {
    state = {
        data: [],
        id: 0,
        nachname: null,
        vorname: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null
      };
    
      // when component mounts, first thing it does is fetch all existing data in our db
      // then we incorporate a polling logic so that we can easily see if our db has 
      // changed and implement those changes into our UI
      
    
      // just a note, here, in the front end, we use the id key of our data object 
      // in order to identify which we want to Update or delete.
      // for our back end, we use the object id assigned by MongoDB to modify 
      // data base entries

      componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
          let interval = setInterval(this.getDataFromDb, 1000);
          this.setState({ intervalIsSet: interval });
        }
      }
    
      // never let a process live forever 
      // always kill a process everytime we are done using it
      componentWillUnmount() {
        if (this.state.intervalIsSet) {
          clearInterval(this.state.intervalIsSet);
          this.setState({ intervalIsSet: null });
        }
      }
    
      // our first get method that uses our backend api to 
      // fetch data from our data base
      getDataFromDb = () => {
        fetch("http://localhost:3001/api/getData")
          .then(data => data.json())
          .then(res => this.setState({ data: res.data }));
      };
    
      // our put method that uses our backend api
      // to create new query into our data base
      putDataToDB = (vorname, nachname) => {
        let currentIds = this.state.data.map(data => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
          ++idToBeAdded;
        }
    
        axios.post("http://localhost:3001/api/putData", {
          id: idToBeAdded,
          vorname: vorname,
          nachname: nachname
        });
      };
    
    
      // our delete method that uses our backend api 
      // to remove existing database information
      deleteFromDB = idTodelete => {
        let objIdToDelete = null;
        this.state.data.forEach(dat => {
          if (dat.id === idTodelete) {
            objIdToDelete = dat._id;
          }
        });
    
        axios.delete("http://localhost:3001/api/deleteData", {
          data: {
            id: objIdToDelete
          }
        });
      };
    
    
      // our update method that uses our backend api
      // to overwrite existing data base information
      updateDB = (idToUpdate, updateToApply) => {
        let objIdToUpdate = null;
        this.state.data.forEach(dat => {
          if (dat.id === idToUpdate) {
            objIdToUpdate = dat._id;
          }
        });
    
        axios.post("http://localhost:3001/api/updateData", {
          id: objIdToUpdate,
          update: { message: updateToApply }
        });
      };
    


    render() {
        
        return (
            <form>
                Vorname: <br/>
                <input type="text" onChange={e => this.setState({ vorname: e.target.value })}/>
                <br/>
                Nachname: <br/>
                <input type="text" onChange={e => this.setState({ nachname: e.target.value  })}/>
                <br/>
                <button onClick={() => this.putDataToDB(this.state.vorname, this.state.nachname)}> 
                    OK
                </button>
            </form>
        )
    }
}

export default Formular;