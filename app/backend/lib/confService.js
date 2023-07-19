const CONSTANTS = require('../../common/constants');
const fse = require('fs-extra');
const switchService = require('./switchService')
const Device = require('../../common/models').Device;
const Conf = require('../../common/models').Conf;
const Conf_new = require('../../common/models').Conf_new;
const fs = require("fs");

const TEMPLATE_CONFIG =  {
    "available": [],
    "unavailable": [],
    "newDevice": []
}


function readConf() {
    return JSON.parse(fse.readFileSync(CONSTANTS.confPath));
}

function writeConf(conf) {
    fse.writeFileSync(CONSTANTS.confPath, JSON.stringify(conf, null, 2));
}

function existsConfig(){
    return fse.existsSync(CONSTANTS.confPath);
}



async function readConfigFile(){
    if(!existsConfig()){
        await writeConf(TEMPLATE_CONFIG)
    }
    return new Promise((resolve, reject)=>{
        fs.readFile(CONSTANTS.confPath, 'utf8', function (err, data) {
        if (err) {
            reject(err);
        } 
        if(data){
            resolve(JSON.parse(data))
        } else {
            resolve(undefined)
        }
        });
    })
}

async function syncConf_new(){
    try{
        //TODO: se il file di configurazione non esiste, deve essere ricreato
        let storedConf = await readConfigFile();
        if(!storedConf){
            throw 'config file does not exist';
        }
    
        const allDevices = await switchService.getDevices();
        if(!allDevices){
            throw 'device not available from HA'
        }
        let HAdevices = allDevices.filter(CONSTANTS.filterDevice);

        let newConf = new Conf_new(new Array(), new Array(), new Array()).toJson();

        storedConf?.available?.map((device, idx)=>{
            device.state = null;
            const {updatedDevice, idxFind} = getDeviceFromHAList(HAdevices, device);

            if(updatedDevice){
                device.state = updatedDevice.state;
                newConf.available.push(device);
                delete HAdevices[idxFind];
            }else{
                newConf.unavailable.push(device);
            }
        });

        storedConf?.unavailable?.map((device, idx)=>{
            device.state = undefined;
            const {updatedDevice, idxFind} = getDeviceFromHAList(HAdevices, device);

            if(updatedDevice){
                device.state = updatedDevice.state;
                delete HAdevices[idxFind];
            }

            newConf.unavailable.push(device);
        });

        HAdevices.map((device)=>{
            let name = CONSTANTS.getFriendlyName(device);
            newConf.newDevice.push(new Device(device.entity_id, undefined, name, device.state))
        });

        newConf.available = normalizePriorities_new(newConf.available);
        writeConf(newConf);
        return newConf
    }catch(error){
        throw error;
    }
}

function normalizePriorities_new(availableDevice){
    if(availableDevice && availableDevice.length > 0){
        availableDevice.sort((a,b)=> a?.priority - b?.priority);
        availableDevice.map((d, idx) => d.priority = idx + 1);
        return availableDevice;
    }
    return [];
}

function getDeviceFromHAList(HAdevices, storedDevice) {
    let idxFind = null;
    const updatedDevice = HAdevices.find((haDevice, idx)=> {
        if(haDevice?.entity_id === storedDevice?.entity_id){
            idxFind = idx;
            return true;
        }
        return false;
    });
    return {idxFind, updatedDevice}
}


async function changePriority(entityId, priority, upPriority){

    if(!entityId || !priority){
        throw 'entityId & priority must be defined';
    }
    
    let storedConf = await readConfigFile();
    if(!storedConf){
        throw 'config file does not exist';
    }

    let flegFind = false;
    storedConf?.available.map((device)=>{
        if(device.entity_id === entityId){
            flegFind = true;
            device.priority = priority;
        }
        if(device.entity_id !== entityId && device.priority === priority){
            //plus/minus 0.5 for simplify process to normalize priority
            device.priority =  upPriority ? device.priority + 0.5 : device.priority - 0.5;
        }
    });

    if(!flegFind){
        throw 'entityId not found';
    }
    
    storedConf.available = normalizePriorities_new(storedConf.available);
    writeConf(storedConf);
    return storedConf;
}

async function newToAvailable(entityId){

    if(!entityId){
        throw 'entityId & priority must be defined';
    }
    
    let storedConf = await readConfigFile();
    if(!storedConf){
        throw 'config file does not exist';
    }

    let foundedDevice = undefined;
    for(let i = 0; i < storedConf?.newDevice.length; i++){
        const device = storedConf?.newDevice[i]
        if(device.entity_id === entityId){
            foundedDevice = device;
            storedConf?.newDevice.splice(i, 1);
            break;
        }
    }

    if(!foundedDevice){
        throw 'entityId not found';
    }
    foundedDevice.priority = 99999;
    storedConf?.available.push(foundedDevice);
    storedConf.available = normalizePriorities_new(storedConf.available);

    writeConf(storedConf);
    return storedConf;
}

async function deviceManager(addToAvailable, removeToAvailable){

    let storedConf = await readConfigFile();
    if(!storedConf){
        throw 'config file does not exist';
    }

    if(addToAvailable?.length > 0){
        storedConf.newDevice = storedConf?.newDevice.filter((device)=>{
            if(addToAvailable.includes(device.entity_id)){
                let foundedDevice = device;
                foundedDevice.priority = 99999;
                storedConf?.available.push(foundedDevice);
                return false;
            }else{
                return true;
            }
        });
    }

    if(removeToAvailable?.length > 0){
        storedConf.available = storedConf?.available.filter((device)=>{
            if(removeToAvailable.includes(device.entity_id)){
                let foundedDevice = device;
                foundedDevice.priority = null;
                storedConf?.newDevice.push(foundedDevice);
                return false;
            }else{
                return true;
            }
        });
    }

    storedConf.available = normalizePriorities_new(storedConf.available);

    writeConf(storedConf);
    return storedConf;
}



//TODO: CREATA SOPRA LA NUOVA VERSIONE, QUESTA VERRA DEPRECATA
async function syncConf() {
    try {
        console.log("sono qui syncConf")
        const storedConf = await readConfigFile();
        console.log("FILE LETTO ",storedConf)
    
        const allDevices = await switchService.getDevices();
        const devices = allDevices.filter(CONSTANTS.filterDevice);
    
        let safeConf = new Conf(new Array()).toJson();
        for (const d of devices) {
            const reliableDevice = getNewOrOld(storedConf, d);
            let name = CONSTANTS.getFriendlyName(reliableDevice);
            safeConf.devices.push(new Device(reliableDevice.entity_id, reliableDevice.priority, name, reliableDevice.state).toJson())
        }
    
        writeConf(normalizePriorities(safeConf));
    } catch (error) {
        console.log("ERROR", error)
    }
}

//TODO: getDeviceFromHAList è IL SUO SOTITTUTO, questa la dovremmo eliminare
function getNewOrOld(storedConf, device) {
    //return stored device
    for (const d of storedConf.devices) {
        //FIXME: Cosi facendo, se lo stato è cambiato del device, non viene aggiornato
        if (d.entity_id === device.entity_id) {
            return d;
        }
    }

    //return new device
    return device;
}



//TODO: è stata create una nuova versione sopra, questa verrà eliminata
function normalizePriorities(unsortedConf) {
    unsortedConf.devices.sort(CONSTANTS.sortPriority);

    let unprioritized = new Array();
    let prioritized = new Array();

    for (const device of unsortedConf.devices) {
        //FIXME: I device che non hanno proprità, non hanno priorità di default a 0 ma undefined... per cui andranno nella lista dei 
        // prioritized invece che unprioritized
        if (device.priority === 0) {
            unprioritized.push(device);
        } else {
            prioritized.push(device);
        }
    }

    sorted = new Array();

    for (let i = 0; i < prioritized.length; i++) {
        let p = i + 1;
        prioritized[i].priority = p;
        sorted.push(prioritized[i]);
    }

    for (let i = 0; i < unprioritized.length; i++) {
        let p = i + prioritized.length + 1;
        unprioritized[i].priority = p;
        sorted.push(unprioritized[i]);
    }

    return new Conf(sorted).toJson();
}

module.exports = {
    syncConf, readConf, writeConf, readConfigFile, syncConf_new, changePriority, newToAvailable, deviceManager
}