import createListComponent from "./createListComponent";

const FixedSizeList = createListComponent({
  getEstimatedTotalSize: ({ itemSize, itemCount }) => itemSize * itemCount,
  getItemSize: ({ itemSize }) => itemSize,
  getItemOffset: ({ itemSize }, index) => itemSize * index,
  getStartIndexForOffset: ({ itemSize }, scrollOffset) =>
    Math.floor(scrollOffset / itemSize),
  getStopIndexForStartIndex: ({ itemSize, height }, startIndex) =>
    startIndex + Math.ceil(height / itemSize) - 1,
});

export default FixedSizeList;
