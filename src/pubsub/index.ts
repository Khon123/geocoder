import EventPubSub from "event-pubsub";
import { EventType } from "./enums";
const events = new EventPubSub();

type Callback = (param?: any) => void;

function addListener(eventName: EventType, callback: Callback) {
  events.on(eventName, callback);
  return { remove: () => events.off(eventName, callback) };
}

function emit(eventName: EventType, params: Record<string, any> | string) {
  events.emit(eventName, params);
}

export default {
  Type: EventType,
  emit,
  addListener,
};
