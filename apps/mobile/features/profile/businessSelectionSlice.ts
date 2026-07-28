import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type BusinessSelectionState = {
    selectedBusinessId: number | null;
};

function resolveSelectedBusinessId(businessIds: number[], selectedBusinessId: number | null) {
    return selectedBusinessId !== null && businessIds.includes(selectedBusinessId)
        ? selectedBusinessId
        : (businessIds[0] ?? null);
}

const initialState: BusinessSelectionState = { selectedBusinessId: null };

const businessSelectionSlice = createSlice({
    name: "businessSelection",
    initialState,
    reducers: {
        setSelectedBusinessId(state, action: PayloadAction<number | null>) {
            state.selectedBusinessId = action.payload;
        },
    },
});

export const { setSelectedBusinessId } = businessSelectionSlice.actions;
export { resolveSelectedBusinessId };
export default businessSelectionSlice.reducer;
