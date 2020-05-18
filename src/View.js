import React, { useState } from 'react';
import * as _ from 'lodash';

import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ZkbApi from './zkbapi.js'
import config from './config.js'

export default class View extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            cards: new Array()
        }

        const api = new ZkbApi(config.zkillboard_stat_url)
        const request = api.makeRequest()
        const self = this
        request.then(allianceData => {
            console.log(allianceData)
            self.state.data = allianceData
            const cardTemplates = [
                {
                    title: 'Danger Ratio',
                    text: `Our danger ratio is currently ${allianceData.dangerRatio}`
                },
                {
                    title: 'ISK destroyed (kills)',
                    text: `${self.formatMoney(allianceData.iskDestroyed)} ISK`
                },
                {
                    title: 'ISK lost (losses)',
                    text: `${self.formatMoney(allianceData.iskLost)} ISK`
                },
                {
                    title: 'Ships destroyed (kills)',
                    text: `${allianceData.shipsDestroyed} ships`
                },
                {
                    title: 'Ships lost (losses)',
                    text: `${allianceData.shipsLost} ships`
                },
                {
                    title: 'Solo kills',
                    text: `${allianceData.shipsDestroyed} kills`
                },
                {
                    title: 'Solo losses',
                    text: `${allianceData.shipsLost} losses`
                },
                {
                    title: 'Top list (pilots)',
                    text: _.map(allianceData.topLists[0].values, obj => {
                        return (
                        <b>{obj.characterName + ': ' + obj.kills + ' kills'}<br /></b>
                        )
                    })
                },
                {
                    title: 'Top list (corporations)',
                    text: _.map(allianceData.topLists[1].values, obj => {
                        return (
                        <b>{obj.corporationName + ': ' + obj.kills + ' kills'}<br /></b>
                        )
                    })
                }
            ]
            const cards = _.map(cardTemplates, template => {
                return self.makeCardWithData(template.title, template.text)
            })
    
            console.log(cards)
            self.setState({ cards: cards })
        })
    }

    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-" : "";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
      
          return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
          console.log(e)
        }
    }

    makeCardWithData(title, text) {
        return (
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card style={{ width: '18rem' }} className="text-center">
                        <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        <Card.Text>
                            {text}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                    <br />
                </Col>
            </Row>
        )
    }

    componentDidMount() {
        
    }

    render() {
        //
        console.log(this.state)
        return (
                <Container className="p-3">
                <Row>
                <Jumbotron>
                    <h1 className="header">HC killboard statistics</h1>
                </Jumbotron>
                </Row>
                {this.state.cards}
            </Container>
        )
    }
}