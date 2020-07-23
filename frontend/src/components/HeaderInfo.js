import React from 'react';
import { Row, Col, Input } from 'antd';
import '../css/index.css'
import logo from "../assets/logo1.png";
import {AdminAvatar} from "./AdminAvatar";
import {history} from "../utils/history";
const {Search} = Input;

export class HeaderInfo extends React.Component {
    backToHome=()=>
    {
        if (history.location.pathname !== "/")
        history.push("/")
    }

    render(){
        // const user = JSON.parse(localStorage.getItem("user"));
        // console.log("user info:",user);
        return(
            <div id="header">
                <div id="header-content" >
                    <Row>
                        <Col span={3}>
                         <a>  <img alt="logo" onClick={this.backToHome} src={logo} style={{height: 60}} id="logo"/> </a>
                        </Col>
                        <Col span={6}>
                            <Search/>
                        </Col>
                        <Col span={6} offset={9}>
                            <AdminAvatar/>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
