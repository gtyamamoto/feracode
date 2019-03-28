import React,{Fragment} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import {BrowserRouter, Switch, Route} from  'react-router-dom'
import App from './App';
import Shop from './components/Shop';
import ProductDetails from './components/ProductDetails';
import * as serviceWorker from './serviceWorker';
import Navbar from './components/navbar'
ReactDOM.render(
    <Fragment>
       
<BrowserRouter>
<Navbar />
<Switch>
            <Route path="/" exact={true} component={App} />
            <Route path="/shop" component={Shop} />
            <Route path="/product/:id" component={ProductDetails} />
        </Switch>
</BrowserRouter>

    </Fragment>


, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
