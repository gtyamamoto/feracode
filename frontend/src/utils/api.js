
import fetch from 'isomorphic-fetch';

export const endpointAPI = process.env.NODE_ENV==='production' ? '/api' : 'http://localhost:8080/api';

export const requestGetDiapers  = async (url=null)=>{
    const fetchDiapers = await fetch(url!==null ? url :`${endpointAPI}/diapers?active=true` ,{
        method:'GET',
        headers:{
            'content-type':'application/json'
        }
    });
    return await fetchDiapers.json()
}
export const requestGetDiaper = async (id)=>{
    const fetchDiaper = await fetch(`${endpointAPI}/diapers/${id}`,{
        method:'GET',
        headers:{
            'content-type':'application/json'
        } 
    });
    return await fetchDiaper.json()
}
export const requestPostDiaper = async(diaper)=>{
    const fetchDiaper = await fetch(`${endpointAPI}/diapers`,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        } ,
        body:JSON.stringify(diaper)
    });
    return await fetchDiaper.json()
}
export const requestUpdateDiaper = async(id,diaper)=>{
    const fetchDiaper = await fetch(`${endpointAPI}/diapers/${id}`,{
        method:'PUT',
        headers:{
            'content-type':'application/json'
        } ,
        body:JSON.stringify(diaper)
    });
    return await fetchDiaper.json()
}

export const requestDeleteDiaper = async(id)=>{
    const fetchDiaper = await fetch(`${endpointAPI}/diapers/${id}`,{
        method:'PUT',
        headers:{
            'content-type':'application/json'
        } ,
        body:JSON.stringify({active:false})
    });
    return await fetchDiaper.json()
}
export const requestCreateSale = async(sale)=>{
    const fetchSale = await fetch(`${endpointAPI}/sales`,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        } ,
        body:JSON.stringify(sale)
    });
    return await fetchSale.json() 
}

export const getReportDiaperBySize = async (model,size)=>{
    const fetchReport = await fetch(`${endpointAPI}/reports/diaper_stock?model=${model}&size=${size}`,{
        method:"GET",
        headers:{
            'content-type':'application/json'
        }
    })
    return await fetchReport.json()
}

export const returnPageUrlDiapers = number=>{
    return `${endpointAPI}/diapers?skip=${(number-1)*30}&active=true`;
}