import React, { useEffect,useCallback } from 'react';
import {Link} from 'react-router-dom';
import {useGlobal} from 'reactn'
import { requestGetDiapers, returnPageUrlDiapers, requestUpdateDiaper, requestCreateSale, getReportDiaperBySize } from './utils/api';
const App = props=> {
  const [ diapers, setDiapers ] = useGlobal('diapers');
  const [ pagination, setPagination ] = useGlobal('pagination');
  const [ activeDiaper, setActiveDiaper ] = useGlobal('activeDiaper');
  const getFetchs =async (page)=> {
    let url = null;
      if(page){
        url = returnPageUrlDiapers(page);
      }
      const diapersFetch = await requestGetDiapers(url)
      console.log(diapersFetch.results)
      
     
      setDiapers(diapersFetch.results);
      setPagination({pages:diapersFetch.pages,next:diapersFetch.next})
  
    } ;
  useEffect(()=>{
   
      getFetchs()
      
  }
    
  ,[]);
  const handleAddSale = async (e,diaper)=>{
    if(e.target.classList.contains('disabled'))return false
    
    console.log(e.target)
    const sizeVal = document.querySelector(`select[diaper-id="${diaper._id}"`).value;
   
    const findIndexsize =diaper.sizes.findIndex(el=>el.size===sizeVal)
    
    diaper.sizes[findIndexsize].total = diaper.sizes[findIndexsize].total -1; 
    const diaperSell = await requestUpdateDiaper(diaper._id,diaper)
    if(diaperSell.message){
     return alert('It was not possible to buy the diaper,try again later')
    }
    const createSell = await requestCreateSale({model:diaper.model,size:sizeVal,quantity:1})
    if(createSell.error||createSell.message){
      return alert((createSell.error||createSell.message))
     }
     else{
       const findDiaperIndex = diapers.findIndex(el=>el._id===diaper._id);
       diapers[findDiaperIndex]=diaper;
       setDiapers(diapers)
       alert('You bought successfully!!')
       document.querySelector(`select[diaper-id="${diaper._id}"`).selectedIndex = 0;
       document.querySelector(`.display-message-stock[diaper-id="${diaper._id}"]`).textContent="No Predictions Available"
     }
    
  }
  const handleChangeDiaper = async (e,diaper)=>{
    const value = e.target.value;
    const diaperMsg = document.querySelector(`.display-message-stock[diaper-id="${diaper._id}"]`)
    const btn = document.querySelector(`.list-group-item[diaper-id="${diaper._id}"] .btn-buy-diaper`);
    if(value==='Choose...') {
      btn.textContent="Select a valid size";
      btn.classList.add('disabled')
      diaperMsg.textContent="No Predictions Available"
      return false;}
    const findSizeTotal = diaper.sizes.find(el=>el.size===value).total;
   
    if(findSizeTotal>0){
      btn.textContent="Buy";
      btn.classList.remove('disabled')
      //search for predictions
      const fetchPrediction = await getReportDiaperBySize(diaper.model,value);
      if(fetchPrediction.message){
        console.log(fetchPrediction.message);
        diaperMsg.textContent="No Predictions Available"
      }else
      diaperMsg.textContent=`It will take ${fetchPrediction.prediction} seconds to end the stock,Hurry up!`;
    }else{
      btn.textContent="Out Of Stock";
      btn.classList.add('disabled')
      diaperMsg.textContent="No Predictions Available"
    }
    

  }

  const createPageListItems = (pages)=>{
    let pagesComp = [];
    for(let i=0;i<pages;i++) pagesComp.push(<li className="list-inline-item" onClick={()=>getFetchs(i+1)}>{i+1}</li>)
    return pagesComp
  }
 
  
    return (
      <div className="container">
     
      <Link className="btn btn-primary my-2" to="/productnew">Add new Diaper</Link>
      <h3 className="p-3 my-2">Diapers List</h3>
        <div className="row text-center">
        {!diapers.length ? <p>No Diapers, add Now!</p> :  <ul className="list-group list-products">
          {diapers.map(diaper=><li className="list-group-item row" key={diaper._id} diaper-id={diaper._id}><p className="col-auto my-1"><strong>Model:</strong> {diaper.model} <Link className="btn btn-primary float-right" to={`/product/${diaper._id}`}>Edit</Link></p> <div class="col-auto my-1">
      <label class="mr-sm-2">Pick a Size</label>
      <select class="custom-select size-select mr-sm-2"  diaper-id={diaper._id} defaultValue="Choose..." onChange={(e)=>{handleChangeDiaper(e,diaper)}} >
        <option key="default">Choose...</option>
       { diaper.sizes.map(size=><option key={size.id}>{size.size}</option>)}
      </select>
    </div>
    <p className=" my-2" >Stock prediction: <span className="display-message-stock" diaper-id={diaper._id} ></span></p>
    <span className="ml-4 btn btn-success btn-buy-diaper disabled" onClick={(e)=>{handleAddSale(e,diaper)}}>Select a valid size</span></li>)}
          </ul>}
         
        </div>
        {pagination.pages!==0 && <div class="row text-center">
        <h4>Pages
          <ul className="d-block list-inline mt-2">
            {
              createPageListItems(pagination.pages)
            }
          </ul>
          </h4>
          </div>}
      </div>
    );
  
}

export default App;
