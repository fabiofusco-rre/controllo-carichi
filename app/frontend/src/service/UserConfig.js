/* eslint-disable no-throw-literal */
import ChronoSettings from "../config/chronothermostat.json"


class UserConfig {

  userConfig = null;
  zones = [];
  configZones = {}
  devices = {};

  constructor(userConfigFile){
    this.userConfig = userConfigFile;
    this.zones = Object.keys(this.userConfig.zone);
    this.configZones = this.userConfig.zone
    this.devices = userConfigFile?.device || {};
  }

  getUserConfig(){
    return this.userConfig;
  }

  getZones(){
    return this.zones;
  }

  setNewZone(zoneName){
    let newZone = ChronoSettings.templateZone;
    newZone.zoneName = zoneName;
    
    this.zones.push(zoneName);
    this.configZones[zoneName] = newZone;
  }

  getConfigZones(){
    return this.configZones;
  }

  getConfigZone(zone){
    if(!this.configZones[zone]){
      throw "zone does not exist"
    }
    return this.configZones[zone];
  }

  setConfigZone(zone, configZone){
    this.configZones[zone] = configZone;
  }

  getWorkModeZone(zone){
    const configZone = this.getConfigZone(zone);
    return configZone.workMode;
  }

  setWorkModeZone(zone, workMode){
    let configZone = this.getConfigZone(zone);
    configZone.workMode = workMode;
    this.setConfigZone(zone, configZone);
  }

  setNewSetPointValue(zone, workMode, value){
    let worksMode = this.getWorkModeZone(zone);
    worksMode[workMode] = value;
    this.setWorkModeZone(zone, worksMode);
  }

  getWeeklyProgramZone(zone){
    const configZone = this.getConfigZone(zone);
    return configZone.weeklyProgramming;
  }

  getDailyScheduleZone(zone, day, withSetPoint=false){
    const weeklyProgramming = this.getWeeklyProgramZone(zone);
    let schedule = weeklyProgramming[day]?.schedule
    if(!schedule){
      throw "schedule day does not exist"
    }
    if(withSetPoint){
      const workMode = this.getWorkModeZone(zone);
      schedule = schedule.map((i)=>{
        i.setPoint = workMode[i.workMode];
        return i;
      })
    }
    return schedule;
  }
  
  setDailyScheduleZone(zone, day, schedule){
    this.configZones[zone].weeklyProgramming[day].schedule = schedule;
  }

  getDeviceList(){
    return Object.keys(this.devices).map((deviceId)=>{
      return this.devices[deviceId]
    })
  }

  setDevicesList(deviceList){
    let deviceObj = {};
    deviceList.map((device)=>{
      deviceObj[device.deviceId] = device;
    })
    this.devices = deviceObj;
  }

  getZoneDevicesList(zone){
    let zoneDevices = [];
    let devices = this.getDeviceList();
    devices.forEach((device)=>{
      if(device.idZone === zone){
        return zoneDevices.push(device);
      }
    })
    return zoneDevices;
  }
}


let _userConfig = null;

const initUserConfig = (userConfigFile) => {
  if (!_userConfig) {
    _userConfig = new UserConfig(userConfigFile)
  }
  return _userConfig
}

const getUserConfig = () => {
  if(_userConfig){
    return _userConfig;
  }
  throw "Must init"
}

export { initUserConfig, getUserConfig }
