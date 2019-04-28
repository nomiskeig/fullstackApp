

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

export {deleteFromDB};
