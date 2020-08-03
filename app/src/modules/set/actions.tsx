import { makeVar, ReactiveVar } from "@apollo/client";
import { Item, Items, itemOrUndefined } from "../item/actions";
import { getCurrentWS } from "../../modules/workspace/actions";
import * as _ from "lodash";

export interface Set {
  id: number;
  set_id_on_server?: number | null;
  name: string;
  items: Items;
}

type setOrUndefined = Set | undefined;

interface addItem {
  id: number;
  set_id_on_server?: number | null;
  name?: string;
  item: Item & { update_data?: string };
}

export type Sets = Array<Set | undefined>;

interface Status {
  id: number;
  is_set: boolean;
}

export const setStatus = makeVar<Array<Status>>([]);
export const Sets = makeVar<Sets>([]);
export const setCount = makeVar<number>(0);
export const itemCount = makeVar<number>(0);

export function useSet(sets: ReactiveVar<Sets> = Sets) {
  const allSets = () => Sets();
  const if_set_defined = (id: number) => _.find(Sets(), { id: id });
  const addSet = (newSet: Set) => {
    if (if_set_defined(newSet.id) === undefined) {
      Sets([...Sets(), newSet]);
    }
  };
  const deleteItem = (id: number, item_id: number) => {
    let newItems = [];
    let sets = Sets()
      .map((set: Set | undefined) => {
        if (set !== undefined && set.id == id) {
          newItems = set.items.filter((item: Item) => item.id !== item_id);
          if (newItems.length !== 0)
            return {
              id,
              set_id_on_server: set.set_id_on_server,
              name: set.name,
              items: newItems,
            };
        } else {
          return set;
        }
      })
      .filter((set: any) => set);
    Sets(sets);
    return newItems.length;
  };

  const deleteSetOnEditPage = (set_id_on_server: string | undefined) => {
    Sets(
      Sets().filter((set: any) => set?.set_id_on_server !== set_id_on_server)
    );
  };

  const createSet = (set: Partial<Set> & { id: number }) => {
    let new_set: Set;
    let is_defined = if_set_defined(set.id);
    if (is_defined === undefined) {
      new_set = {
        id: set.id,
        set_id_on_server: set.set_id_on_server ?? null,
        name: set.name ?? "Set",
        items: set.items ?? [],
      };
      Sets([...Sets(), new_set]);
    } else {
      new_set = is_defined;
    }
    return new_set;
  };

  const addateItem = (newItem: addItem) => {
    let item = newItem.item;
    let this_set: Set | undefined = if_set_defined(newItem.id);
    if (this_set === undefined) throw "There's not this set.";

    let this_item = _.find(this_set.items, {
      id: item.id,
    });
    let newItems: Item[] | undefined;
    if (this_item === undefined) {
      let newItem = {
        id: item.id,
        id_on_server: item.id_on_server ?? undefined,
        type: item.type ?? "line", // null or undefined
        data: item.data ?? "",
        description: item.description ?? "",
        note: item.note ?? "",
      };
      newItems = [...this_set.items, newItem];
    } else {
      let updated_item: Item;
      if (item.update_data === "type") {
        updated_item = { ...this_item, type: item.type };
      } else if (item.update_data === "data") {
        updated_item = { ...this_item, data: item.data };
      } else if (item.update_data === "description") {
        updated_item = { ...this_item, description: item.description };
      } else if (item.update_data === "note") {
        updated_item = { ...this_item, note: item.note };
      } else if (item.update_data === "companion") {
        /* TODO: quiz, highlight, etc. conditionals will be written in here. */
        updated_item = { ...this_item, note: item.note };
      } else {
        console.log("error: addateItem receive an unexpected type of data.");
      }

      newItems = this_set.items.map((_item: Item) => {
        if (_item.id == item.id) {
          return updated_item;
        } else {
          return _item;
        }
      });
    }
    let updated_set: Set = {
      id: this_set.id,
      set_id_on_server: this_set?.set_id_on_server ?? null,
      name: this_set.name,
      items: newItems,
    };
    let sets = Sets().map((set: setOrUndefined) => {
      if (
        set !== undefined &&
        this_set !== undefined &&
        set.id == this_set.id
      ) {
        return updated_set;
      } else {
        return set;
      }
    });
    Sets(sets);
  };
  const updateName = (id: number, name: string) => {
    let sets = Sets().map((set: setOrUndefined) => {
      if (set !== undefined && set.id == id) {
        return {
          id,
          set_id_on_server: set.set_id_on_server,
          name,
          items: set.items,
        };
      } else {
        return set;
      }
    });
    Sets(sets);
  };
  const addWSId = (set: Partial<Set>) => ({
    ...set,
    ws_id: getCurrentWS().id,
  });
  const filterSet = (): string => {
    let set = allSets()
      .filter((set: setOrUndefined) => set)
      .map((set: setOrUndefined) => {
        return addWSId({
          ...set,
          items: set?.items.filter((item: itemOrUndefined) => {
            if (item instanceof Object && "data" in item && item["data"] !== "")
              return true;
            else return false;
          }),
        });
      });
    return JSON.stringify(set);
  };
  const cleanSet = () => Sets([]);

  const updateSetStatus = (id: number, set_or_not: boolean) => {
    let new_statuses: Status[] = [];
    let this_status = _.find(setStatus(), { id: id });
    if (this_status !== undefined) {
      new_statuses = setStatus().map((status: Status) => {
        if (status.id === id) {
          return {
            id,
            is_set: set_or_not,
          } as Status;
        } else {
          return status;
        }
      });
    } else {
      new_statuses = [
        ...setStatus(),
        {
          id,
          is_set: set_or_not,
        },
      ] as Status[];
    }
    setStatus(new_statuses);
  };

  const takeIdForSet = () => setCount(setCount() + 1) && setCount();
  const takeIdForItem = () => itemCount(itemCount() + 1) && itemCount();

  return {
    allSets,
    addateItem,
    deleteItem,
    deleteSetOnEditPage,
    updateName,
    filterSet,
    cleanSet,
    createSet,
    updateSetStatus,
    takeIdForSet,
    takeIdForItem,
  };
}
