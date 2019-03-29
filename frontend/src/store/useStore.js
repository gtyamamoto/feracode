


import { setGlobal } from 'reactn';


export function initStore(){
  setGlobal( {diapers: [],
    activeDiaper : {
        description:'',
        model:'',
        sizes:[],
        _id:null,
    },
    pagination : {
        pages:0,
        next:null
    }});
}
