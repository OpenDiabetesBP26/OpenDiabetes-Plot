import React, { Component } from 'react';
import Home from './components/Home';
import About from './components/About';
import D3Sample from './components/D3Sample';
import NotFound from './components/NotFound';
import Chart from './components/Chart';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {hot} from 'react-hot-loader';
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
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <a className="navbar-brand" href="#">Open Diabetes Plot</a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <NavItem id="nav_home" path="/" name="Home" />
                                    <NavItem id="nav_d3sample" path="/d3sample" name="D3Sample" />
                                    <NavItem id="nav_about" path="/about" name="About" />
                                    <NavItem id="nav_chart" path="/chart" name="Chart" />
                                </ul>
                            </div>
                        </nav>
                    </header>
                    <main>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/d3sample' component={(props) => <D3Sample {...props} />}/>
                        <Route exact path='/chart' component={(props) => <Chart {...props} />}/>
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