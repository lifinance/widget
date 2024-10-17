import { useSettingsActions } from "../../stores/settings/useSettingsActions.js";
import type { Appearance } from "../../types/widget.js";
import { useSettingsStore } from "./useSettingsStore.js";

export const useAppearance = (): [
	Appearance,
	(appearance: Appearance) => void,
] => {
	const { setValue } = useSettingsActions();
	const appearance = useSettingsStore((state) => state.appearance);
	const setAppearance = (appearance: Appearance) => {
		setValue("appearance", appearance);
	};
	return [appearance, setAppearance];
};
