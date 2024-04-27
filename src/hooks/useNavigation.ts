import type { ModifiedNavigationItemType, NavigationItemType } from "@types";
import { type MouseEventHandler, useState } from "react";

const updateItems = (items: ModifiedNavigationItemType[], id: string) => {
	return items.map((item): ModifiedNavigationItemType => {
		if (item.items) {
			return {
				...item,
				expanded: item.id === id ? !item.expanded : item.expanded,
				items: item.id === id ? item.items : updateItems(item.items, id),
			};
		}
		return { ...item, active: item.id === id ? !item.active : false };
	});
};

export const useNavigation = (base: NavigationItemType[]) => {
	const [items, setItems] = useState<ModifiedNavigationItemType[]>(base);

	const onClickHandler: MouseEventHandler<HTMLLIElement> = (e) => {
		const id = e.currentTarget.id;

		setItems((prev) => updateItems(prev, id));
	};

	return { items, setItems, onClickHandler };
};
