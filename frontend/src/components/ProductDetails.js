import React, { useState,useEffect } from "react";
import {default as UUID} from "node-uuid";
import {Redirect} from 'react-router';
import  {useGlobal} from 'reactn'
import { requestGetDiaper, requestUpdateDiaper, requestPostDiaper, requestDeleteDiaper } from "../utils/api";
const ProductDetails = props => {
  const [activeDiaper, setActiveDiaper ] = useGlobal('activeDiaper');
  const [successForm,setSuccess] = useState(false);
  const id = props.match.params.id ? props.match.params.id : null
  const getDiaperData = async (id)=>{
    const diaperData = await requestGetDiaper(id)
  
    setActiveDiaper(diaperData)
  }
  useEffect(() => {
    if (id) {
      console.log(id)
      getDiaperData(id)
     
     
    }
    else{
      setActiveDiaper({
        description:'',
        model:'',
        sizes:[],
        _id:null,
    })
    }
    
  }, []);
  const deleteDiaper = async (e)=>{
    e.preventDefault();
    const deleteDiaper = await  requestDeleteDiaper(id);
    if(deleteDiaper.message){
      alert(deleteDiaper.message)
    }else{
      setSuccess(true)
    }
  }
  const submitDiaper = async (e)=>{
    e.preventDefault();
    console.log(id)
    if(id!==null){
      const diaperUpdated = await requestUpdateDiaper(id,activeDiaper)
      setActiveDiaper({
        description:'',
        model:'',
        sizes:[],
        _id:null,
    })
    if(diaperUpdated.message){
      alert(diaperUpdated.message)
    }else{
      setSuccess(true)
    }
     
      
    }else{
      const diaperCreated = await requestPostDiaper(activeDiaper)
      setActiveDiaper({
        description:'',
        model:'',
        sizes:[],
        _id:null,
    })
    if(diaperCreated.message){
      alert(diaperCreated.message)
    }else{
      setSuccess(true)
    }
    }
  }
  const handleChangeDescription = (e)=>{
    const value = e.target.value;
    activeDiaper.description = value
    setActiveDiaper(activeDiaper)
  }
  const handleChangeModel = (e)=>{
    const value = e.target.value;
    activeDiaper.model = value
   setActiveDiaper(activeDiaper)
  }
  const addNewSize = ()=>{
    console.log(activeDiaper)

  
  activeDiaper.sizes.push({size:'',total:0,id:UUID.v4()})
 setActiveDiaper(activeDiaper)
  }
  const handleChangeSizeName = (e)=>{
    const id = e.target.getAttribute('size-id');
    const indextofind = activeDiaper.sizes.findIndex(el=>el.id==id);
    activeDiaper.sizes[indextofind].size = e.target.value;
    setActiveDiaper(activeDiaper)
  }
  const handleChangeSizeTotal = (e)=>{
    const id = e.target.getAttribute('size-id');
    const indextofind = activeDiaper.sizes.findIndex(el=>el.id==id);
    activeDiaper.sizes[indextofind].total = e.target.value;
    setActiveDiaper(activeDiaper)
  }
  const handleDeleteSize = (e)=>{
    e.preventDefault()
    const id = e.target.getAttribute('size-id');
    activeDiaper.sizes =  activeDiaper.sizes.filter(el=>el.id!=id);
    setActiveDiaper(activeDiaper)
  }

  return successForm ? <Redirect to="/"/> : (
    <div className="container">
      <h3 className="p-3 my-2">Add/Edit a Diaper</h3>
      <div className="row text-center">
        <form className="card p-4">
          <div className="form-group row">
            <label for="model">Model</label>
            <input
              type="text"
              className="form-control"
              id="model"
              value={activeDiaper.model}
              onChange={handleChangeModel}
              placeholder="Model of the diaper"
            />
          </div>
          <div className="form-group row">
            <label for="description">Description</label>
            <textarea onChange={handleChangeDescription}   value={activeDiaper.description} className="form-control" id="description" rows="4" />
          </div>
          <div className="form-group row card">
          <h4 className="p-2">Sizes <span className="btn btn-primary ml-4" onClick={addNewSize}>Add a new Size</span></h4>
          {activeDiaper&&activeDiaper.sizes.length>0 && (
            <ul className="list-group">
              {activeDiaper.sizes.map(el =>
              (<li className="list-group-item" key={`size-${el.id}`}><div className="row">
              <div className="col">
              <input
              type="text"
              className="form-control"
              size-id={el.id}
              value={el.size}
              onChange={handleChangeSizeName}
              placeholder="Name of the size"
            />
              </div>
              <div className="col">
              <input
              type="number"
              className="form-control"
              size-id={el.id}
              value={el.total}
              onChange={handleChangeSizeTotal}
              placeholder="on Stock"
            />
              </div>
              <div className="col">
              <button className="btn btn-danger" size-id={el.id} onClick={handleDeleteSize}>Delete</button>
              </div>
          </div></li>))}
            </ul>
          )}
          </div>
          <button className="btn btn-success mt-2" onClick={submitDiaper}>Submit</button>
          {id && <button className="btn btn-danger mt-2" onClick={deleteDiaper}>Delete Model of Diaper</button>}
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
