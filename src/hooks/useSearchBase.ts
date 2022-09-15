import { debounce, omit } from "lodash";
import { BaseMaps, Z1MapAPI } from "../core";
import * as helper from "../utils/index";
import * as turf from "@turf/turf";

type IProps = {
  map: any;
  state: any;
  setState: any;
};
let oldSource: any = {};
let pingMarker: any;

export const useSearchBase = ({ map, state, setState }: IProps) => {
  const filteredTags = [
    // 'village',
    // 'village_center',
    "commune_boundary",
    // 'commune_center',
    "district_boundary",
    // 'district_center',
    "province_boundary",
    // 'province_center',
  ];

  const tags = { tags: filteredTags.join(",") };

  const categories = { categories: "landmark" };

  const newParams = { ...tags, ...categories };

  const apiRequest = async (param: any = {}) => {
    const params = { per_page: 12, ...newParams, ...param };
    const { data } = await new Z1MapAPI().fetchPlaceTextSearch(
      params,
      (source) => {
        oldSource = source;
      }
    );
    const results = params.q ? data.data : [];
    const pageInfo = { ...params, ...omit(data, ["data"]) };
    return { results, pageInfo };
  };

  const fetchingAPI = debounce(async (search: string) => {
    cancelRequest("researching");
    setState({ loading: true });
    try {
      const resp: any = await apiRequest({ q: search });
      setState({ ...resp });
    } catch (err: any) {
      if (err?.message) return;
      setState({ results: [], pageInfo: {} });
    } finally {
      setState({ loading: false });
    }
  }, 360);

  const fetchAPINext = async (params = {}) => {
    if (state.loadMore) return;
    cancelRequest("researching");
    setState({ loadMore: true });
    const resp = await apiRequest(params);
    setState({ loadMore: false });
    return resp;
  };

  const flyToMarker = (place: string) => {
    pingMarker = helper.flyToMarker(place, map);
  };

  const flytoAPlace = async ({ href }: any) => {
    cancelRequest("researchingAdminPlace");
    const {
      data: { data },
    } = await new Z1MapAPI().fetchingPlacesByBoundary(href);
    const bbox = turf.bbox(data.boundary);
    map.fitBounds(bbox);
    helper.onAddGeoJsonBoundary(data.boundary, map);
  };

  const cancelRequest = (msg = "cancelled") => {
    oldSource?.cancel && oldSource.cancel(msg);
  };

  const handleSearch = (value: string) => {
    if (value) {
      if (helper.isLatLonText(value)) {
        setState({ results: undefined, pageInfo: undefined });
        return;
      }
      fetchingAPI(value);
    } else {
      setState({ results: undefined, pageInfo: undefined });
    }
  };

  const handleSubmit = async (field: any) => {
    if (helper.isLatLonText(field.search)) {
      const search = helper.stringToLocation(field.search);
      flyToMarker(search);
      setState({ results: undefined, pageInfo: undefined });
      return;
    }
    handleSearch(field.search);
  };

  const handleItemSelect = (form: any, item: any) => {
    form.change("search", item.name);
    if (item && item?.href) {
      flytoAPlace(item);
      return;
    }
    item && flyToMarker(item);
  };
  const handleClickLocation = (location: string) => {
    flyToMarker(location);
  };
  const handleClearData = (form: any) => {
    form.reset();
    setState({ results: undefined, pageInfo: undefined });
  };
  return {
    onSearch: handleSearch,
    onSelectedItem: handleItemSelect,
    fetchAPINext,
    onSubmit: handleSubmit,
    onClickLocation: handleClickLocation,
    onClearData: handleClearData,
  };
};
