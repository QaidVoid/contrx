import { initClient } from "@ts-rest/core";
import { API_URL } from "../lib/constants";
import { contract } from "./contract";

const api = initClient(contract, {
  baseUrl: API_URL,
  baseHeaders: {},
  credentials: "include"
});

export default api;
