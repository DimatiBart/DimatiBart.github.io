const batteryStatusCodes = new Map([[0, "Unknown"],
                               [1, "Battery Low"],
                               [2, "Battery charging"],
                               [3, "Battery full (charging)"],
                               [4, "Not charging"]]);

  /* Custom Bluetooth Service UUIDs */

  const MIBAND_SERVICE_UUID = 0xFEE0;
  const IOS_SERVICE_UUID = 0xFEE7;

  /* Custom Bluetooth Characteristic UUIDs */

  const BATTERY_INFO_UUID = 0xFF0C;
  const BLE_CONNECTION_PARAMETERS_UUID = 0xFF09;
  const CONTROL_POINT_UUID = 0xFF05;;
  const DATETIME_UUID = 0xFF0A;
  const DEVICE_INFO_UUID = 0xFF01;
  const DEVICE_NAME_UUID = 0xFF02;
  const NOTIFICATIONS_UUID = 0xFF03;
  const STEPS_UUID = 0xFF06;
  const ACTIVITY_DATA_UUID = 0xFF07;
  const USER_INFO_UUID = 0xFF04;
  const MAC_ADDRESS_UUID = 0xFEC9;


  class Band {
    constructor() {
      this.device = null;
      this.server = null;
      this._characteristics = new Map();
      this._debug = false;
    }
    connect() {
      let options = {filters:[{services:[ MIBAND_SERVICE_UUID ]}],
                     optionalServices: [ IOS_SERVICE_UUID ]};
      return navigator.bluetooth.requestDevice(options)
      .then(device => {
        this.device = device;
        this.device.addEventListener('gattserverdisconnected',this._onDisconnect);
        return device.gatt.connect();
      })
      .then(server => {
        this.server = server;
        return Promise.all([
          server.getPrimaryService(MIBAND_SERVICE_UUID).then(service => {
            return Promise.all([
              this._cacheCharacteristic(service, BATTERY_INFO_UUID),
              this._cacheCharacteristic(service, BLE_CONNECTION_PARAMETERS_UUID),
              this._cacheCharacteristic(service, CONTROL_POINT_UUID),
              this._cacheCharacteristic(service, DATETIME_UUID),
              this._cacheCharacteristic(service, DEVICE_INFO_UUID),
              this._cacheCharacteristic(service, DEVICE_NAME_UUID),
              this._cacheCharacteristic(service, NOTIFICATIONS_UUID),
              this._cacheCharacteristic(service, STEPS_UUID),
              this._cacheCharacteristic(service, ACTIVITY_DATA_UUID),
              this._cacheCharacteristic(service, USER_INFO_UUID),
            ])
          }),
          server.getPrimaryService(IOS_SERVICE_UUID).then(service => {
            return this._cacheCharacteristic(service, MAC_ADDRESS_UUID);
          }),
        ]);
      })
    }

    /* MiBand Service */

    getDeviceInfo() {
      return this._readCharacteristicValue(DEVICE_INFO_UUID)
      .then(data => {
        let deviceInfo = new Map();
        deviceInfo.set('firmwareVersion', data.getUint8(15) + '.' + data.getUint8(14) + '.' + data.getUint8(13) + '.' + data.getUint8(12));
        deviceInfo.set('profileVersion', data.getUint8(11) + '.' + data.getUint8(10) + '.' + data.getUint8(9) + '.' + data.getUint8(8));
        return deviceInfo;
      });
    }
    getBatteryInfo() {
      return this._readCharacteristicValue(BATTERY_INFO_UUID)
      .then(data => {
        let lastChargeDate = new Date(2000 + data.getUint8(1),
                                      data.getUint8(2),
                                      data.getUint8(3),
                                      data.getUint8(4),
                                      data.getUint8(5),
                                      data.getUint8(6));
        let batteryInfo = new Map();
        batteryInfo.set('batteryLevel', data.getUint8(0));
        batteryInfo.set('batteryStatusCode', data.getUint8(9));
        batteryInfo.set('batteryStatusText', batteryStatusCodes.get(data.getUint8(9)));
        batteryInfo.set('batteryCharges', 0xffff & (0xff & data.getUint8(7) | (0xff & data.getUint8(8) << 8)));
        batteryInfo.set('batteryLastCharge', lastChargeDate);
        return batteryInfo;
      });
    }
    getBluetoothConnectionParameters() {
      return this._readCharacteristicValue(BLE_CONNECTION_PARAMETERS_UUID)
      .then(data => {
        let deviceInfo = new Map();
        deviceInfo.set('firmwareVersion', data.getUint8(15) + '.' + data.getUint8(14) + '.' + data.getUint8(13) + '.' + data.getUint8(12));
        deviceInfo.set('profileVersion', data.getUint8(11) + '.' + data.getUint8(10) + '.' + data.getUint8(9) + '.' + data.getUint8(8));
        return deviceInfo;
      });
    }
    getDateTime() {
      return this._readCharacteristicValue(DATETIME_UUID)
      .then(data => {
        let date = new Date(data.getUint8(0) + 2000,
                            data.getUint8(1),
                            data.getUint8(2),
                            data.getUint8(3),
                            data.getUint8(4),
                            data.getUint8(5));
        return date;
      });
    }
    pair(reset) {
      if (!reset) {
        return this.setUserInfo(reset);
      } else {
        return this._readCharacteristicValue(BLE_CONNECTION_PARAMETERS_UUID)
        .then(data => {
          let timeout = 0xffff & (0xff & data.getUint8(6) | (0xff & data.getUint8(7)) << 8)
          if (timeout < 250) {
            // FIXME: Use a high supervision timeout to avoid a connection timeout.
            let params = [39, 0, 39, 0, 0, 0, 208, 7, 39, 0, 96, 9];
            return this._writeCharacteristicValue(BLE_CONNECTION_PARAMETERS_UUID, new Uint8Array(params))
            .then(() => this.setUserInfo(reset));
          } else {
            return this.setUserInfo(reset);
          }
        });
      }
    }
    getMacAddress() {
      return this._readCharacteristicValue(MAC_ADDRESS_UUID).then(data => {
        for (var i = 0, a = []; i < data.byteLength; i++) {
          a.push(String('00' + data.getUint8(i).toString(16)).slice(-2));
        }
        return a.join(':');
      });
    }
    setUserInfo(reset) {
      return this.getMacAddress().then(macAddress => {
        let uuid = 1586927552; // UUID must have 10 digits.
        let gender = 1; // Gender (Female 0, Male 1)
        let age = 21; // Age in years.
        let height = 175; // Height in cm.
        let weight = 64; // Weight in kg.
        let type = reset ? 1 : 0; // If 1, all saved data will be lost.

        let userInfo = [];
        for (var i = 0; i < 4; i++) { userInfo.push(uuid & 0xff); uuid >>= 8; }
        userInfo.push(gender);
        userInfo.push(age);
        userInfo.push(height);
        userInfo.push(weight);
        userInfo.push(type);
        for (var i = 0; i < 10; i++) { /* Alias */ userInfo.push(0); }
        let crc = (this._computeCRC(userInfo) ^ parseInt(macAddress.slice(-2), 16));
        userInfo.push(crc);

        return this._writeCharacteristicValue(USER_INFO_UUID, new Uint8Array(userInfo));
      });
    }
    setDateTime() {
      let today = new Date();
      let date = [(today.getFullYear() - 2000) & 0xff,
                  today.getMonth(),
                  today.getDate(),
                  today.getHours(),
                  today.getMinutes(),
                  today.getSeconds()];
      return this._writeCharacteristicValue(DATETIME_UUID, new Uint8Array(date));
    }
    setBandLocation(loc) {
      // Left hand (0), right hand (1), neck (2).
      return this._writeCharacteristicValue(CONTROL_POINT_UUID, new Uint8Array([0x0f, loc]));
    }
    factoryReset() {
      return this._writeCharacteristicValue(CONTROL_POINT_UUID, new Uint8Array([9]));
    }

    /* Utils */

    _cacheCharacteristic(service, characteristicUuid) {
      return service.getCharacteristic(characteristicUuid)
      .then(characteristic => {
        this._characteristics.set(characteristicUuid, characteristic);
      });
    }
    _readCharacteristicValue(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      return characteristic.readValue()
      .then(data => {
        if (this._debug) {
          for (var i = 0, a = []; i < data.byteLength; i++) { a.push(data.getUint8(i)); }
          console.debug('READ', characteristic.uuid, a);
        }
        return data;
      });
    }
    _writeCharacteristicValue(characteristicUuid, value) {
      let characteristic = this._characteristics.get(characteristicUuid);
      if (this._debug) {
        console.debug('WRITE', characteristic.uuid, value);
      }
      return characteristic.writeValue(value);
    }
    _computeCRC(data) {
      let crc = 0;
      for (var i = 0; i < data.length; ++i) {
        crc ^= data[i];
        for (var j = 0; j < 8; ++j) {
          let odd = crc & 1;
          crc = crc >> 1;
          if (odd) crc ^= 140;
        }
      }
      return crc;
    }
    _onDisconnect(event){
      let device = event.target;
      console.log(`MR. ${device.name} has left the building :C`);
    }
    getSteps() {
      return this._readCharacteristicValue(STEPS_UUID)
      .then(data => {
        return this.parseSteps(data);
      });
    }
    parseSteps(data) {
      return data.getUint8(0) | (data.getUint8(1) << 8) |
          (data.getUint8(2) << 16) | (data.getUint8(3) << 24);
    }
    scanSteps(callback){
      let characteristic = this._characteristics.get(STEPS_UUID);
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        let data = event.target.value;
        callback(this.parseSteps(data));
      })
      characteristic.startNotifications();
    }
    stopScanSteps(){
      this._characteristics.get(STEPS_UUID).stopNotifications();
    }
    getDeviceName(){
      return this.deviceName;
    }
  }
