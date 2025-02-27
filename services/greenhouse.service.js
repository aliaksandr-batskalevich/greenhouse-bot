import * as GreenhouseApi from '../api/greenhouse.api.js';

export const getGreenhouses = async location => {
  try {
    return GreenhouseApi.getGreenhouses(location);
  } catch (e) {
    console.log(e);
  }
};

export const saveNewGreenhouse = async (name, location, width, length) => {
  try {
    return GreenhouseApi.saveNewGreenhouse(name, location, width, length);
  } catch (e) {
    console.log(e);
  }
};
