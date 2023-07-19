const CONSTANTS = require('../../common/constants');
const fetch = require('node-fetch');



const supervisorDevices = 'http://supervisor/core/api/states';
/**HA endpoints */
const supervisorService = 'http://supervisor/core/api/services';
const prod_config = {
    host: "http://supervisor/core",
    token: process.env.SUPERVISOR_TOKEN
};

const mac_samir_config = {
    host: "homeassistant.local:9000",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5Y2I1MjYwZDAwOWU0MmIxODcxYzE5YjZiNzkzNjcxMyIsImlhdCI6MTY4NDkzMTgzMywiZXhwIjoyMDAwMjkxODMzfQ.XAAQwiK2jVBUikJQlaDTmn-yx8G9FwPufAs1bdkT2pk",
};
  
  const hub_strutture = {
    host: "192.168.6.10:8123",
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhYzM4MWYyZmM5MjA0MDgyYTMzYjQ4ODI5NWU5ZWY4ZiIsImlhdCI6MTY4OTMyMDQ3OSwiZXhwIjoyMDA0NjgwNDc5fQ.WXuZngYNFKWUXfMQnGaGksRFNv2_pnZHXDm8bMLZZ-o",
};
const CONFIG = hub_strutture;

  


function getDevices() {
    return fetch(`http://${CONFIG.host}/api/states`, {
        method: "get",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.token}`
        },
    })
    .then(async (response) => {
        console.log("getDevices - sono la risposta ", JSON.stringify(response, null, 2));
        let res = null;
        try {
            res = await response?.json();
        } catch (error) {
            console.log("Hola", error)
        }
        console.log("sono la res json ", res)
        return res;

    })
    .catch((e) => {
        throw `getDevices failed: ${e}`;
    });
}

function postSwitchState(entity_id, state) {
    return fetch(`${CONFIG.host}/api/states/${entity_id}`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.token}`
        },
        body: `{"state": "${state}"}`
    })
        .then((response) => {
            console.log("postSwitchState-response", response)
            response.json()
        })
        .catch((e) => {
            console.log("postSwitchState-catch-error", e)
            throw `postSwitchState failed: ${e}`;
        });
}

function postSwitchStateEntity(entity_id, state) {
    let serviceType = state === 'on' ? 'turn_on' : 'turn_off'
    return fetch(`http://${CONFIG.host}/api/services/switch/${serviceType}`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.token}`
        },
        body: `{"entity_id": "${entity_id}"}`
    })
        .then((response) => {
            console.log("postSwitchStateEntity-response", response)
            response.json()
        })
        .catch((e) => {
            console.log("postSwitchStateEntity-catch-error", e)
            throw `postSwitchStateEntity failed: ${e}`;
        });
}

function getLeastimportantWithStateOn(conf) {
    conf.available.sort(CONSTANTS.sortPriority);
    const withStateOn = conf.available.filter((device) => { return device.state === 'on' });
    return withStateOn[withStateOn.length - 1]?.entity_id;
}

function getMostImportantWithStateOff(conf) {
    conf.devices.sort(CONSTANTS.sortPriority);
    const withStateOff = conf.devices.filter((device) => { return device.state === 'off' });
    return withStateOff[0]?.entity_id;
}

module.exports = {
    getDevices,
    postSwitchState,
    getLeastimportantWithStateOn,
    getMostImportantWithStateOff,
    postSwitchStateEntity
}