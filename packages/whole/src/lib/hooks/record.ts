import { useState } from "react";

export function useRecord<K extends object>(initialState?: K) {
  const initialValue: { [keyId: string]: K } = {};
  if (initialState !== undefined && initialState instanceof Array) {
    initialState.forEach((record) => {
      if ("id" in record) {
        initialValue[record.id as string] = record;
      }
    });
  }

  const [record, setRecord] = useState<{ [keyId: string]: K }>(Object.freeze(initialValue));

  const set = (value: K) => {
    const keyId = "id" in value ? String(value.id) : crypto.randomUUID();
    const nextRecord = Object.freeze({ ...record, [keyId]: { ...value, id: keyId } });
    return setRecord(nextRecord);
  };
  const remove = (key: string) => {
    const nextRecord = { ...record };
    delete nextRecord[key];
    return setRecord(nextRecord);
  };

  return [record, set, remove] as const;
}
