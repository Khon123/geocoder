import axios from "axios";
import { isEmpty, isFunction } from "lodash";
import { CancelledFn } from "../types";

const CancelToken = axios.CancelToken;

const instance: any = axios.create({
  baseURL: "https://mapapi.zillennium.com/v1",
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
export default class Z1MapAPI {
  api: any;
  constructor() {
    this.api = instance;
  }

  getCancelRequest() {
    return CancelToken.source();
  }

  private request(
    url: string,
    method = "GET",
    params: Record<string, any> = {}
  ) {
    const options: any = { url, method, headers: {} };
    method = method.toLowerCase();

    let cancelToken: any = null;
    if (!isEmpty(params)) {
      if (method === "get") {
        options.params = params;
      } else {
        options.data = params;
      }
      cancelToken = params.cancelToken;
    }

    if (cancelToken) {
      delete params.cancelToken;
      options.cancelToken = cancelToken;
    }
    return this.api.request(options);
  }
  private createCancelRequest(params: any, fnCancelled: CancelledFn) {
    const source = this.getCancelRequest();
    params.cancelToken = source.token;
    fnCancelled(source);
  }

  fetchingPlacesByBoundary(url: string, fnCancelled?: CancelledFn) {
    if (isFunction(fnCancelled)) {
      this.createCancelRequest(url, fnCancelled);
    }
    return this.request(url, "GET");
  }

  fetchPlaceTextSearch(params = {}, fnCancelled?: CancelledFn) {
    if (isFunction(fnCancelled)) {
      this.createCancelRequest(params, fnCancelled);
    }
    return this.request("/places/textsearch", "GET", params);
  }

  fetchPlaceNearBySearch(params = {}, fnCancelled?: CancelledFn) {
    if (isFunction(fnCancelled)) {
      this.createCancelRequest(params, fnCancelled);
    }
    return this.request("/places/nearbysearch", "GET", params);
  }

  fetchGeoLocation(at: string, fnCancelled?: CancelledFn) {
    const params = { at };
    if (isFunction(fnCancelled)) {
      this.createCancelRequest(params, fnCancelled);
    }
    return this.request("/places/geolocation", "GET", params);
  }
}
// export default new Z1MapAPI();
