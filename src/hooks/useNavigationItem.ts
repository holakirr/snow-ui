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

export const useNavigationItem = (base: NavigationItemType) => {
	const [item, setItem] = useState<ModifiedNavigationItemType>({
		...base,
		expanded: false,
		active: false,
	});

	const onClickHandler: MouseEventHandler<HTMLLIElement> = (e) => {
		const id = e.currentTarget.id;
		setItem((prev) => {
			if (prev?.items) {
				return {
					...prev,
					expanded: prev.id === id ? !prev.expanded : prev.expanded,
					items: updateItems(prev.items, id),
				};
			}
			return { ...prev, active: prev.id === id ? !prev.active : false };
		});
	};
	return { item, setItem, onClickHandler };
};
