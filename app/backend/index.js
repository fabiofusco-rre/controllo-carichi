#!/usr/bin/env node
const confService = require('./lib/confService');
const switchService = require('./lib/switchService');
const express = require('express');
const app = express();
const CONSTANTS = require('../common/constants');
const cors = require("cors");
const { successResponse } = require('../common/responseHandler');

(async function init() {
    try {
        await confService.syncConf_new();
    } catch (error) {
        console.error("[ERROR-INIT] syncConf", error)
    }
})();

app.use(cors());

app.use(express.json(), express.static(CONSTANTS.publicDir));

app.get('/', (req, res) => {
    res.sendFile(CONSTANTS.frontPath);
});

app.get('/conf', async (req, res) => {
    try {
        await confService.syncConf_new();
        const conf = confService.readConf();
        successResponse
        res.json(successResponse(conf));
    } catch (e) {
        res.status(502).send();
        throw `get at /conf failed: ${e}`
    }
});

app.post('/conf', (req, res) => {
    try {
        confService.writeConf(req.body);
        res.status(200).send();
    } catch (e) {
        res.status(502).send();
        throw `post at /conf failed: ${e}`
    }
});


app.post('/priority', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const {entityId, priority, upPriority} = req.body;
        const config = await confService.changePriority(entityId,  priority, upPriority);
        res.status(200).send(successResponse(config));
    } catch (e) {
        console.log("sono l'errore", e)
        res.status(502).send(JSON.stringify(e));
    }
});


app.post('/device/manager', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const {addToAvailable, removeToAvailable} = req.body;
        const config = await confService.deviceManager(addToAvailable, removeToAvailable);
        res.status(200).send(successResponse(config));
    } catch (e) {
        console.log("sono l'errore", e)
        res.status(502).send(JSON.stringify(e));
    }
});


app.post('/new/to/available', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const {entityId} = req.body;
        const config = await confService.newToAvailable(entityId);
        res.status(200).send(config);
    } catch (e) {
        console.log("sono l'errore", e)
        res.status(502).send(JSON.stringify(e));
    }
});

app.get('/switch', async (req, res) => {

    await confService.syncConf_new();
    let entity_id, newState;

    switch (req.query.scale) {
        case 'up':
            entity_id = switchService.getMostImportantWithStateOff(confService.readConf());
            newState = 'on'
            res.status(200);
            break;
        case 'down':
            console.log("case - down")
            entity_id = switchService.getLeastimportantWithStateOn(confService.readConf());
            newState = 'off';
            res.status(200);
            break;
        default:
            res.status(422).send;
            throw `post at /switch failed: Illegal arguments`;
    }

    console.log("execute  postSwitchState", entity_id, newState)
    if(entity_id){
        await switchService.postSwitchStateEntity(entity_id, newState);
        await (()=>{return new Promise((resolve)=>{setTimeout(()=>resolve(),500)})})()
    }

    const config = await confService.syncConf_new();
    res.status(200).send(successResponse(config));
});

//NEW
app.get('/mok/switch', async (req, res) => {

    console.log("REQUEST /mok/switch", req.query)
    let entity_id = req.query.entityId
    let newState = req.query.state

    console.log("execute  postSwitchStateEntity", entity_id, newState)
    switchService.postSwitchStateEntity(entity_id, newState);

    console.log("execute  syncConf")
    await confService.syncConf();

    console.log("make response")
    res.send()

});
//NEW
app.get('/devices', async (req, res) => {
    const devices = await switchService.getDevices()
    res.json(devices);
});

app.listen(CONSTANTS.port, () => {
    console.log(`Load manager api listening on port ${CONSTANTS.port}`)
});