import React, { Component } from 'react';
import Home from './components/Home';
import About from './components/About';
import D3Sample from './components/D3Sample';
import NotFound from './components/NotFound';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {hot} from 'react-hot-loader';
import data from '../data/2019-11-20-1349_export-data.json';
const NavItem = props => {
    const pageURI = window.location.pathname+window.location.search
    const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link"
    return (
      <li className={liClassName}>
        <a id={props.id} href={props.path} className={aClassName}>{props.name}</a>
        {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
      </li>
    );
  }

export class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <header>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <a class="navbar-brand" href="#">Open Diabetes Plot</a>
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul class="navbar-nav">
                                    <NavItem id="nav_home" path="/" name="Home" />
                                    <NavItem id="nav_d3sample" path="/d3sample" name="D3Sample" />
                                    <NavItem id="nav_about" path="/about" name="About" />
                                </ul>
                            </div>
                        </nav>
                    </header>
                    <main>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/d3sample' component={(props) => <D3Sample {...props} data={data}/>}/>
                        <Route exact path='/about' component={About} />
                        <Route path="*" component={NotFound} />
                    </Switch>
                    </main>
                </div>
            </BrowserRouter>
        );
    }

}


export default hot ? hot(module)(App) : App;