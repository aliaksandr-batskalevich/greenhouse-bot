import greenhouseApiClient from '../client/greenhouse-api.client.js';

export async function getTempSensors(location) {
  const requestConfig = {
    method: 'GET',
    url: 'temp-sensor',
    params: { location },
  };

  return greenhouseApiClient.request(requestConfig).then(res => res.data);
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
  const requestConfig = {
    method: 'POST',
    url: 'temp-sensor',
    data: {
      greenhouseId,
      positionX,
      positionY,
      sn,
      name,
      minTemp,
      maxTemp,
    },
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function saveTempSensorChanges(
  id,
  name,
  minTemp,
  maxTemp,
) {
  const requestConfig = {
    method: 'PUT',
    url: 'temp-sensor',
    data: {
      id,
      name,
      minTemp,
      maxTemp,
    },
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function deleteTempSensor(id) {
  const requestConfig = {
    method: 'DELETE',
    url: `temp-sensor/${id}`,
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function activate(id) {
  const requestConfig = {
    method: 'POST',
    url: `temp-sensor/activate`,
    data: { id },
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function deactivate(id) {
  const requestConfig = {
    method: 'DELETE',
    url: `temp-sensor/activate/${id}`,
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function checkTempSensorSn(sn) {
  const requestConfig = {
    method: 'GET',
    url: 'temp-sensor/check-sn',
    params: { sn },
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function checkTempSensorName(name) {
  const requestConfig = {
    method: 'GET',
    url: 'temp-sensor/check-name',
    params: { name },
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}

export async function checkTempSensorPosition(greenhouseId, positionX, positionY) {
  const requestConfig = {
    method: 'GET',
    url: 'temp-sensor/check-position',
    params: {
      ['greenhouse_id']: greenhouseId,
      ['position_x']: positionX,
      ['position_y']: positionY,
    },
  };

  return greenhouseApiClient
    .request(requestConfig)
    .then((res) => res.data);
}
