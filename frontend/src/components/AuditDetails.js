import React from 'react'
import {Button, message, Row, Col, Input} from 'antd'
import '../css/BKDetail.css'
import '../css/Audit.css'
import {searchDetails} from "../services/SearchService";
import {history} from "../utils/history";
import {updateDiseaseinNeo4j} from "../services/DiseaseService";
import {disaproving} from "../services/AuditService";

const DiseaseMenu = ["就诊科室","病因","症状","检查","并发症","治疗","药物","宜吃食物","忌吃食物","传播","预防措施"];
export class AuditDetails extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            Audit: [],
            result: [],
            reason: "不通过",
        }
    }

    callback = (data) => {
        console.log("get ");
        console.log(data);
        if(data.result === null)
        {
            data.result = {name: "这是一个新词条"};
            this.setState({result: data.result });
        }

        this.setState({result: data.result});
        console.log("result", data.result);
    };

    componentDidMount() {
        console.log("Audit is", this.props.Audit);
        let audit = this.props.Audit;
        let value = audit.name;
        let params={'name':value, 'flag':true};
        this.setState({Audit: audit});
        searchDetails(params, this.callback);
    }

    getDetails = (Entry, menu) => {
        if(Entry === null) return "暂无信息";
        if(Entry.length === 0) return "暂无信息";
        if(Entry.id === -1) return "暂无信息";

        const detail = [];
        switch (menu) {
            case "就诊科室":
                let department = Entry.cure_department;
                if(department === null || department === undefined) return "暂无相关资料！";
                for(let i=0; i<Entry.cure_department.length; ++i){
                    detail.push(<p>{department[i].name}<br/></p>)
                }
                console.log("department: ", Entry.cure_department);
                return detail;
            case "病因":
                if(Entry.cause === null || Entry.cause === undefined) return "暂无相关资料！";
                detail.push(<pre>{Entry.cause}</pre>);
                return detail;
            case "症状":
                let related_symptom = Entry.symptom;
                if(related_symptom === null || related_symptom === undefined ) return "暂无相关资料！";
                for(let i=0; i<related_symptom.length; ++i){
                    detail.push(<p>{related_symptom[i].name}<br/></p>)
                }
                return detail;
            case "检查":
                let need_check = Entry.check;
                if(need_check === null || need_check === undefined) return "暂无相关资料！";
                for(let i=0; i<need_check.length; ++i){
                    detail.push(<p>{need_check[i].name}<br/></p>)
                }
                return detail;
            case "并发症":
                let accompany_diseases = Entry.accompany;
                if(accompany_diseases === null || accompany_diseases === undefined) return "无";
                for(let i=0; i<accompany_diseases.length; ++i){
                    detail.push(<p>{accompany_diseases[i].name}<br/></p>)
                }
                return detail;
            case "治疗":
                let cure_by = Entry.cure_way;
                let cure_prob = Entry.cured_prob;
                let yibao_status = Entry.yibao_status;
                let cure_lasttime = Entry.cure_lasttime;
                let cost_money = Entry.cost;
                if(cure_by === null || cure_by === undefined) return "暂无相关资料！";
                for(let i=0; i<cure_by.length; ++i){
                    detail.push(<p>{cure_by[i].name}<br/></p>)
                }
                if(cure_prob !== null && cure_prob !== undefined)
                    detail.push(<span><br/>治愈率: {cure_prob}</span>);
                if(yibao_status !== null && yibao_status !== undefined){
                    if(yibao_status === "是")
                        detail.push(<span><br/>已加入医保</span>);
                    else
                        detail.push(<span><br/>未加入医保</span>)
                }

                if(cure_lasttime !== null && cure_lasttime !== undefined)
                    detail.push(<span><br/>最晚治愈时间: {cure_lasttime}</span>);
                if(cost_money !== null && cost_money !== undefined)
                    detail.push(<span><br/>治疗花费: {cost_money}</span>);
                return detail;
            case "宜吃食物":
                let do_eat = Entry.do_eat;
                if(do_eat === null || do_eat === undefined) return "无";
                for(let i=0; i<do_eat.length; ++i){
                    detail.push(<p>{do_eat[i].name}<br/></p>)
                }
                return detail;
            case "忌吃食物":
                let no_eat = Entry.no_eat;
                if(no_eat === null || no_eat === undefined) return "无";
                for(let i=0; i<no_eat.length; ++i){
                    detail.push(<p>{no_eat[i].name}<br/></p>)
                }
                return detail;
            case "传播":
                let get_way = Entry.get_way;
                let easy_get = Entry.easy_get;
                let get_prob = Entry.get_prob;
                if(get_way !== null && get_way !== undefined)
                    detail.push(<span>感染途径: {get_way}<br/></span>);
                if(easy_get !== null && get_way !== undefined)
                    detail.push(<span>易感人群: {easy_get}<br/></span>);
                if(get_prob !== null && get_prob !== undefined)
                    detail.push(<span>感染率: {get_prob}<br/></span>);
                return detail;
            case "预防措施":
                let prevent = Entry.prevent;
                if(prevent === null || prevent === undefined)
                    return "暂无相关资料！";
                detail.push(<pre>{prevent}</pre>);
                return detail;
            case "药物":
                let flag = true;
                let common_drug = Entry.common_drug;
                let recommend_drug = Entry.recommend_drug;
                if(common_drug !== null && common_drug !== undefined) {
                    detail.push(<span>常用药物:<br/></span>);
                    for(let i=0; i<common_drug.length; ++i){
                        detail.push(<p>{common_drug[i].name}<br/></p>)
                    }
                    flag = false;
                }
                if(recommend_drug !== null && recommend_drug !== undefined) {
                    detail.push(<span>推荐药物:<br/></span>);
                    for(let i=0; i<recommend_drug.length; ++i){
                        detail.push(<p>{recommend_drug[i].name}<br/></p>)
                    }
                    flag = false;
                }
                if(flag)
                    detail.push(<span>暂无相关资料！</span>);
                return detail;
            default: return detail;
        }
    };

    getAuditDetails = (Entry, menu) => {
        if(Entry === null) return "暂无信息";
        if(Entry.length === 0) return "暂无信息";
        if(Entry.id === -1) return "暂无信息";

        const detail = [];
        switch (menu) {
            case "就诊科室":
                let department = Entry.cure_department;
                if(department === null || department === undefined) return "暂无相关资料！";
                for(let i=0; i<Entry.cure_department.length; ++i){
                    detail.push(<p>{department[i]}<br/></p>)
                }
                console.log("department: ", Entry.cure_department);
                return detail;
            case "病因":
                if(Entry.cause === null || Entry.cause === undefined) return "暂无相关资料！";
                detail.push(<pre>{Entry.cause}</pre>);
                return detail;
            case "症状":
                let related_symptom = Entry.symptom;
                if(related_symptom === null || related_symptom === undefined ) return "暂无相关资料！";
                for(let i=0; i<related_symptom.length; ++i){
                    detail.push(<p>{related_symptom[i]}<br/></p>)
                }
                return detail;
            case "检查":
                let need_check = Entry.check;
                if(need_check === null || need_check === undefined) return "暂无相关资料！";
                for(let i=0; i<need_check.length; ++i){
                    detail.push(<p>{need_check[i]}<br/></p>)
                }
                return detail;
            case "并发症":
                let accompany_diseases = Entry.accompany;
                if(accompany_diseases === null || accompany_diseases === undefined) return "无";
                for(let i=0; i<accompany_diseases.length; ++i){
                    detail.push(<p>{accompany_diseases[i]}<br/></p>)
                }
                return detail;
            case "治疗":
                let cure_by = Entry.cure_way;
                let cure_prob = Entry.cured_prob;
                let yibao_status = Entry.yibao_status;
                let cure_lasttime = Entry.cure_lasttime;
                let cost_money = Entry.cost;
                if(cure_by === null || cure_by === undefined) return "暂无相关资料！";
                for(let i=0; i<cure_by.length; ++i){
                    detail.push(<p>{cure_by[i]}<br/></p>)
                }
                if(cure_prob !== null && cure_prob !== undefined)
                    detail.push(<span><br/>治愈率: {cure_prob}</span>);
                if(yibao_status !== null && yibao_status !== undefined){
                    if(yibao_status === "是")
                        detail.push(<span><br/>已加入医保</span>);
                    else
                        detail.push(<span><br/>未加入医保</span>)
                }

                if(cure_lasttime !== null && cure_lasttime !== undefined)
                    detail.push(<span><br/>最晚治愈时间: {cure_lasttime}</span>);
                if(cost_money !== null && cost_money !== undefined)
                    detail.push(<span><br/>治疗花费: {cost_money}</span>);
                return detail;
            case "宜吃食物":
                let do_eat = Entry.do_eat;
                if(do_eat === null || do_eat === undefined) return "无";
                for(let i=0; i<do_eat.length; ++i){
                    detail.push(<p>{do_eat[i]}<br/></p>)
                }
                return detail;
            case "忌吃食物":
                let no_eat = Entry.not_eat;
                if(no_eat === null || no_eat === undefined) return "无";
                for(let i=0; i<no_eat.length; ++i){
                    detail.push(<p>{no_eat[i]}<br/></p>)
                }
                return detail;
            case "传播":
                let get_way = Entry.get_way;
                let easy_get = Entry.easy_get;
                let get_prob = Entry.get_prob;
                if(get_way !== null && get_way !== undefined)
                    detail.push(<span>感染途径: {get_way}<br/></span>);
                if(easy_get !== null && get_way !== undefined)
                    detail.push(<span>易感人群: {easy_get}<br/></span>);
                if(get_prob !== null && get_prob !== undefined)
                    detail.push(<span>感染率: {get_prob}<br/></span>);
                return detail;
            case "预防措施":
                let prevent = Entry.prevent;
                if(prevent === null || prevent === undefined)
                    return "暂无相关资料！";
                detail.push(<pre>{prevent}</pre>);
                return detail;
            case "药物":
                let flag = true;
                let common_drug = Entry.common_drug;
                let recommend_drug = Entry.recommend_drug;
                if(common_drug !== null && common_drug !== undefined) {
                    detail.push(<span>常用药物:<br/></span>);
                    for(let i=0; i<common_drug.length; ++i){
                        detail.push(<p>{common_drug[i]}<br/></p>)
                    }
                    flag = false;
                }
                if(recommend_drug !== null && recommend_drug !== undefined) {
                    detail.push(<span>推荐药物:<br/></span>);
                    for(let i=0; i<recommend_drug.length; ++i){
                        detail.push(<p>{recommend_drug[i]}<br/></p>)
                    }
                    flag = false;
                }
                if(flag)
                    detail.push(<span>暂无相关资料！</span>);
                return detail;
            default: return detail;
        }
    };

    update=()=>{
        let path= {
            pathname:'/UpdateEntryDetail',
            state:this.state.result
        };
        history.push(path);
    };

    updateNeo4j = () => {
        updateDiseaseinNeo4j(this.state.Audit, this.message);
    };

    disaproving = () => {
        let audit = this.state.Audit;
        console.log("reason", this.state.reason);
        disaproving(audit.stringid, this.state.reason, this.message);
    };

    handelChange(e){
        console.log(e.target.value);
        this.setState({
            reason:e.target.value
        })
    }

    message = (data) => {
        if(data !== null && data !== undefined){
            message.success("操作成功!");
            history.push("/EntryAuditS");
        }
        else  {
            message.error("操作失败!");
        }

    };

    render() {
        const audit = [];
        const foot = [];

        for(let i=0; i<DiseaseMenu.length; ++i){
            audit.push(
                <Row>
                    <Col span={12}>
                        <div className="content-p">
                            <div className="title-1">
                                <div className="bk-flex">
                                    <div className="title-detail">
                                <span>
                                    {DiseaseMenu[i]}
                                </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {this.getDetails(this.state.result, DiseaseMenu[i])}
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="content-p">
                            <div className="title-1">
                                <div className="bk-flex">
                                    <div className="title-detail">
                                <span>
                                    {DiseaseMenu[i]}
                                </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {this.getAuditDetails(this.state.Audit, DiseaseMenu[i])}
                            </div>
                        </div>
                    </Col>
                </Row>
            );
        }

        if(this.state.Audit.status === "待审核"){
            foot.push(
                <div>
                    <Button id="permit" onClick={()=>this.updateNeo4j()}>通过</Button>
                    <Button id="reject" type={"danger"} onClick={()=>this.disaproving()}>不通过</Button>
                    <div>
                        <span>理由: </span>
                        <Input id="reason" defaultValue="不通过" onChange={this.handelChange.bind(this)}/>
                    </div>

                </div>
            )
        }
        else if(this.state.Audit.status === "未通过"){
            let reason = this.state.Audit.reason;
            if(reason === null || reason === ""){
                reason = "无";
            }
            foot.push(
                <div>
                    <div>
                        <p className="title-2">未通过！</p>
                        <span>理由: </span>
                        <p>{reason}</p>
                        <span>审核时间:</span>
                        <p>{this.state.Audit.audit_date}</p>
                    </div>
                </div>
            )
        }
        else {
            foot.push(
                <div>
                    <div>
                        <p className="title-3">已通过！</p>
                        <span>审核时间:</span>
                        <p>{this.state.Audit.audit_date}</p>
                    </div>

                </div>
            )
        }


        return(
            <div>
                <Row>
                    <Col span={12}>
                        <div id="name_before" className="bk-title bk-font36 content-title">
                            {this.state.result.name}
                        </div>

                        <div className="bk-title bk-font14 bk-color-topagrey content-sub-title">
                            (修改前)
                        </div>

                        <div className="content-summary">
                            <span id="desc_before">{this.state.result.desc}<br/><br/></span>
                        </div>

                    </Col>
                    <Col span={12}>
                        <div id="name_after" className="bk-title bk-font36 content-title">
                            {this.state.Audit.name}
                        </div>

                        <div className="bk-title bk-font14 bk-color-topagrey content-sub-title">
                            (修改后)
                        </div>

                        <div className="content-summary">
                            <span id="desc_after">{this.state.Audit.desc}<br/><br/></span>
                        </div>
                    </Col>
                </Row>
                {audit}

                {foot}

            </div>

        )
    }
}

