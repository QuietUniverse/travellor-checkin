import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    queryKeyword: "",
    locationId: null,
    results: [],
    appliedRange: 0,
    appliedFilter: "0",
    selectedDate: "",
    selectedResult: null,
    resultIsLoading: false,
  },
  reducers: {
    setSearchResults(state, action) {
      const data = action.payload.data.data;
      const removedAds = data.map(
        (result) => delete result.result_object.special_offers && result
      );
      state.results = removedAds.map(({ result_object: result }, i) => {
        return {
          id: crypto.randomUUID(),
          title: result?.name || "",
          filter: result?.category?.key || "",
          imageUrl: result?.photo?.images?.large?.url || "",
          address: result?.address || "",
          coordinates: {
            latitude: result?.latitude || null,
            longitude: result?.longitude || null,
          },
          rating: result?.rating || null,
          numOfReviews: result?.num_reviews || null,
        };
      });

      state.selectedResult = state.results[0]?.coordinates
        ? state.results[0]
        : null;

      state.locationId = data[0].result_object.location_id;
    },

    setSelectedResult(state, action) {
      state.selectedResult = action.payload.selectedResult;
    },

    setQueryKeyword(state, action) {
      state.queryKeyword = action.payload.queryKeyword;
    },

    setFilterSearchResults(state, action) {
      const data = action.payload.data.data;

      const filterType = data[0]?.subcategory_type;

      if (filterType) {
        const removedAds = data.filter((result) => !result.ad_position);
        state.results = removedAds.map((result) => {
          return {
            id: crypto.randomUUID(),
            title: result?.name || "",
            filter: result?.subcategory_type || "",
            imageUrl: result?.photo?.images?.large?.url || "",
            address: result?.location_string || "",
            coordinates: {
              latitude: result?.latitude || null,
              longitude: result?.longitude || null,
            },
            rating: result?.rating || null,
            numOfReviews: result?.num_reviews || null,
          };
        });

        state.selectedResult = state.results[0]?.coordinates
          ? state.results[0]
          : null;
      } else {
        const removedAds = data.filter((result) => !result.ad_position);
        state.results = removedAds.map((result) => {
          return {
            id: crypto.randomUUID(),
            title: result?.name || "",
            filter: result?.category?.key || "",
            imageUrl: result?.photo?.images?.large?.url || "",
            address: result?.address || "",
            coordinates: {
              latitude: result?.latitude || null,
              longitude: result?.longitude || null,
            },
            rating: result?.rating || null,
            numOfReviews: result?.num_reviews || null,
          };
        });

        state.selectedResult = state.results[0]?.coordinates
          ? state.results[0]
          : null;
      }
    },

    setAppliedFilter(state, action) {
      state.appliedFilter = action.payload.appliedFilter;
    },

    setAppliedRange(state, action) {
      state.appliedRange = action.payload.appliedRange;
    },

    setSelectedDate(state, action) {
      state.selectedDate = action.payload.selectedDate;
    },

    setResultIsLoading(state, action) {
      state.resultIsLoading = action.payload.resultIsLoading;
    },

    resetSelectedDate(state, action) {
      state.selectedDate = "";
    },

    resetFilterAndRange(state, action) {
      state.appliedFilter = "0";
      state.appliedRange = 0;
    },
  },
});

export const searchActions = searchSlice.actions;
export default searchSlice;
