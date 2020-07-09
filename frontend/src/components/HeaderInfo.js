import React from 'react';
import { Row, Col, Input } from 'antd';
import '../css/index.css'
import logo from "../assets/logo1.png";
import {AdminAvatar} from "./AdminAvatar";

const {Search} = Input;

export class HeaderInfo extends React.Component {

    render(){
        // const user = JSON.parse(localStorage.getItem("user"));
        return(
            <div id="header">
                <div id="header-content" >
                    <Row>
                        <Col span={3}>
                            <img alt="logo" src={logo} style={{height: 60}}/>
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