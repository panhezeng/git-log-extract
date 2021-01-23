export const logQueryInitData = {
  dateRange: {
    from: "",
    to: "",
  },
  branches: [],
  author: "",
  loading: false,
  onlyMessage: true,
  noMerges: true,
  dedup:true
};

export type LogQueryData = typeof logQueryInitData;
