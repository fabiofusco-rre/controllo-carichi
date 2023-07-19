class Device {
    entity_id;
    priority;
    name;
    state;

    constructor(entity_id, priority, name, state) {
        this.entity_id = entity_id;
        this.priority = priority;
        this.name = name;
        this.state = state;
    }

    toJson() {
        return {
            "entity_id": this.entity_id,
            "priority": this.priority,
            "name": this.name,
            "state": this.state
        };
    }
}

//TODO: creata sotto al nuova classe sostituitiva
class Conf {
    devices;

    constructor(devicesArr) {
        this.devices = devicesArr;
    }

    toJson() {
        return {
            "devices": this.devices
        }
    }
}

class Conf_new {
    available;
    unavailable;
    newDevice;

    constructor(available, unavailable, newDevice) {
        this.available = available;
        this.unavailable = unavailable;
        this.newDevice = newDevice;
    }

    toJson() {
        return {
            "available": this.available,
            "unavailable": this.unavailable,
            "newDevice": this.newDevice,
        }
    }
}

module.exports = { Device, Conf, Conf_new }