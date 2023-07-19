/**server */
const port = 3001;

/**dirs */
const cwd = typeof (process) === 'undefined' ? '' : process.cwd();
const appRoot = cwd +'/app'
const publicDir = appRoot + '/frontend/build'

/**routes */
const frontPath = publicDir + '/index.html';
const confPath = appRoot + '/backend/data/conf.json';
console.log("confPath", confPath)

/**HA endpoints */
const supervisorDevices = 'http://supervisor/core/api/states';
/**HA endpoints */
const supervisorService = 'http://supervisor/core/api/services';

/**Sorting function */
function sortPriority(a, b) {
    if (a.priority < b.priority) {
        return -1;
    } else if (a.priority > b.priority) {
        return 1;
    } else {
        return 0;
    }
}

/**States filter */
function filterDevice(device) {
    //return (device.state === 'on' || device.state === 'off') && !device.entity_id.includes('update');
    return (device.entity_id?.startsWith('switch.')) && (device.state === 'on' || device.state === 'off') 
}

/**Friedly name function */
function getFriendlyName(device) {
    return device?.attributes?.friendly_name || device?.entity_id;
}

module.exports = {
    port, appRoot, publicDir, frontPath, confPath, supervisorDevices, sortPriority, filterDevice, getFriendlyName, supervisorService
}