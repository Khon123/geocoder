import { TData } from "./types";
import { omit } from "lodash";
import { BaseMaps } from "./core";
import { createRoot } from "react-dom/client";
import { Search } from "./components";

const actions = {};
export default class Geocoder extends BaseMaps {
  storeUnsubscribe: any;
  customComponent: any;

  constructor(options?: TData) {
    const _options = omit(options, ["onWaypointChange"]);
    super(_options, actions);
  }

  static get actions(): typeof actions {
    return actions;
  }

  // get dispatch() {
  //   return store.dispatch;
  // }

  onAdd(map: any) {
    this._map = map;
    let _this = this;
    const dom = (global as any).document;
    const el = (_this.container = dom.createElement("div"));
    el.id = "x-z1data-geocoder";
    el.className =
      "mapboxgl-ctrl-geocoder maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group";
    const root = createRoot(el);
    root.render(<Search map={this._map} />);
    return el;
  }

  onRemove(map: any) {
    this.container.parentNode.removeChild(this.container);
    if (map.getSource("geocoder")) map.removeSource("geocoder");
    this._map = null;
    return this;
  }

  mapState() {
    if (!this._map) return;
  }
}
