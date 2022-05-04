import createListComponent from "./createListComponent";

const DEFAULT_ESTIMATED_ITEM_SIZE = 50;

const getItemMetadata = (props, index, instanceProps) => {
  const { itemSize } = props;
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;
  if (index > lastMeasuredIndex) {
    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }
    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      const size = itemSize(i);
      itemMetadataMap[i] = { offset, size };
      offset += size;
    }
    instanceProps.lastMeasuredIndex = index;
  }
  return itemMetadataMap[index];
};

const findNearestItemBinarySearch = (
  props,
  instanceProps,
  high,
  low,
  offset
) => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getItemMetadata(props, middle, instanceProps).offset;
    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};

const findNearestItemExponentialSearch = (
  props,
  instanceProps,
  index,
  offset
) => {
  const { itemCount } = props;
  let interval = 1;
  while (
    index < itemCount &&
    getItemMetadata(props, index, instanceProps).offset < offset
  ) {
    index += interval;
    interval *= 2;
  }
  return findNearestItemBinarySearch(
    props,
    instanceProps,
    Math.min(index, itemCount - 1),
    Math.floor(index / 2),
    offset
  );
};

const findNearestItem = (props, offset, instanceProps) => {
  const { lastMeasuredIndex, itemMetadataMap } = instanceProps;
  const lastMesuredItemOffset =
    lastMeasuredIndex >= 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
  if (lastMesuredItemOffset >= offset) {
    return findNearestItemBinarySearch(
      props,
      instanceProps,
      lastMeasuredIndex,
      0,
      offset
    );
  } else {
    return findNearestItemExponentialSearch(
      props,
      instanceProps,
      Math.max(0, lastMeasuredIndex),
      offset
    );
  }
};

const VaribleSizeList = createListComponent({
  getEstimatedTotalSize: (
    { itemCount },
    { estimatedItemSize, lastMeasuredIndex, itemMetadataMap }
  ) => {
    let totalSizeOfMeasuredItems = 0;
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size;
    }
    const numOfUnMeasuredItems = itemCount - lastMeasuredIndex - 1;
    const totalSizeOfUnmeasuredItems = numOfUnMeasuredItems * estimatedItemSize;
    return totalSizeOfUnmeasuredItems + totalSizeOfMeasuredItems;
  },
  getItemSize: (props, index, instanceProps) =>
    getItemMetadata(props, index, instanceProps).size,
  getItemOffset: (props, index, instanceProps) =>
    getItemMetadata(props, index, instanceProps).offset,
  getStartIndexForOffset: findNearestItem,
  getStopIndexForStartIndex: (props, startIndex, instanceProps) => {
    const { height, itemCount } = props;
    const itemMetaData = getItemMetadata(props, startIndex, instanceProps);
    const maxOffset = itemMetaData.offset + height;
    let offset = itemMetaData.offset + itemMetaData.size;
    let stopIndex = startIndex;
    while (stopIndex < itemCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata(props, stopIndex, instanceProps).size;
    }
    return stopIndex;
  },
  initInstanceProps: ({ estimatedItemSize }) => {
    const instanceProps = {
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE,
      itemMetadataMap: {},
      lastMeasuredIndex: -1,
    };
    return instanceProps;
  },
});

export default VaribleSizeList;
