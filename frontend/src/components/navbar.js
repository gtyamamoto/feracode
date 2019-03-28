import React from 'react';
import {Link} from 'react-router-dom'

export default ()=>{
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <Link className="navbar-brand" to="/">Navbar</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Alterna navegação">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <Link className="nav-link" to="/">Home <span className="sr-only">(Página atual)</span></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/shop">Buy</Link>
      </li>
    </ul>
  </div>
</nav>
    )
}