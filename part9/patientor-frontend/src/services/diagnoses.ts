import axios from "axios";
import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async () : Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>(
    `${apiBaseUrl}/diagnoses/`
  );

  return data;
};

const getInfo = async (code: string): Promise<Diagnosis> => {
  const { data } = await axios.get<Diagnosis>(
    `${apiBaseUrl}/diagnoses/${code}`
  );

  return data;
};

export default {
  getInfo,
  getAll
};