import * as TempSensorApi from '../api/temp-sensor.api.js';

export async function getTempSensors(location) {
  try {
    return TempSensorApi.getTempSensors(location);
  } catch (e) {
    console.log(e);
  }
}

export async function saveNewTempSensor(
  greenhouseId,
  positionX,
  positionY,
  sn,
  name,
  minTemp,
  maxTemp,
) {
    try {
        return TempSensorApi.saveNewTempSensor(
          greenhouseId,
          positionX,
          positionY,
          sn,
          name,
          minTemp,
          maxTemp,
        );
    } catch (e) {
        console.log(e);
    }
}

export async function saveTempSensorChanges(
  id,
  name,
  minTemp,
  maxTemp,
) {
  try {
    return TempSensorApi.saveTempSensorChanges(
      id,
      name,
      minTemp,
      maxTemp,
    );
  } catch (e) {
    console.log(e);
  }
}

export async function deleteTempSensor(id) {
  try {
    return TempSensorApi.deleteTempSensor(id);
  } catch (e) {
    console.log(e);
  }
}

export async function activateTempSensor(id) {
  try {
    return TempSensorApi.activate(id);
  } catch (e) {
    console.log(e);
  }
}

export async function deactivateTempSensor(id) {
  try {
    return TempSensorApi.deactivate(id);
  } catch (e) {
    console.log(e);
  }
}

export async function checkTempSensorSn(sn) {
  try {
    return TempSensorApi.checkTempSensorSn(sn);
  } catch (e) {
    console.log(e);
  }
}

export async function checkTempSensorName(name) {
  try {
    return TempSensorApi.checkTempSensorName(name);
  } catch (e) {
    console.log(e);
  }
}

export async function checkTempSensorPosition(
  greenhouseId,
  positionX,
  positionY,
  ) {
  try {
    return TempSensorApi.checkTempSensorPosition(
      greenhouseId,
      positionX,
      positionY,
    );
  } catch (e) {
    console.log(e);
  }
}

