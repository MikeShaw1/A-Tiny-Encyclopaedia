import React from 'react';
import { Router, Route, Switch, Redirect} from 'react-router-dom';
import HomeView from "./view/HomeView";
import DetailsView from "./view/DetailsView";
import {history} from "./utils/history";
import SignUpForm from "./components/SignUpForm";
import SignUpView from "./view/SignUpView";

class BasicRoute extends React.Component{

    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            console.log(location,action);
        });
    }

    render(){
        return(
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={HomeView} />
                    <Route exact path="/Details" component={DetailsView} />
                    <Route exact path="/SignUp" component={SignUpView} />
                    <Redirect from="/*" to="/" />
                </Switch>

            </Router>
        )
    }


}

export default BasicRoute;