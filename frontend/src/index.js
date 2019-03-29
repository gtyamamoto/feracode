import React,{Fragment} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import {BrowserRouter, Switch, Route} from  'react-router-dom'
import App from './App';

import ProductDetails from './components/ProductDetails';
import * as serviceWorker from './serviceWorker';
import Navbar from './components/navbar'
import { setGlobal } from 'reactn';
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
ReactDOM.render(
    
       
<BrowserRouter>
<Navbar />
<Switch>
            <Route path="/" exact={true} component={App} />
           
            <Route path="/productnew" component={ProductDetails} />
            <Route path="/product/:id" component={ProductDetails} />
        </Switch>
</BrowserRouter>



, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
