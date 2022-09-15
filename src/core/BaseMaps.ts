import { Callable, TData } from "../types";
import * as mapboxgl from "mapbox-gl";

type Map = typeof mapboxgl;
export class BaseMaps {
  container: any;
  _map: Map;
  options: TData;
  _actions: TData;
  dom: any;

  constructor(options: TData, actions: TData) {
    this.options = options || {};
    // this.dispatch(actions.setOptions(this.options));
    this._actions = actions;
    this.dom = (window as any).document;
  }

  get emptyData() {
    return {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    };
  }

  // get dispatch() {
  //   return store.dispatch;
  // }

  on(type: string, fn: Callable) {
    console.log("on::::", type, fn);
  }
}
