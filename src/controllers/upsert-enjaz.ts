export  function upsert (enjaz: any[], newEnjaz: any) {
	const enjazIndex = enjaz.findIndex((el) => el.id === newEnjaz.id);
	if (enjazIndex === -1) {
		enjaz.push(newEnjaz);
	} else {
		enjaz[enjazIndex] = {
			...enjaz[enjazIndex],
			...newEnjaz,
		};
	}
	return enjaz;
}