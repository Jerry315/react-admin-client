import React, {Component} from 'react'
import {Switch, Route, Redirect} from "react-router-dom";

import AddUpdate from "./add-update";
import ProductDetail from './detail'
import ProductHome from "./home";


export default class Product extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/product/addUpdate" component={AddUpdate}/>
                    <Route exact path="/product/detail" component={ProductDetail}/>
                    <Route exact path="/product" component={ProductHome}/>
                    <Redirect to="/product"/>
                </Switch>
            </div>
        )
    }
}