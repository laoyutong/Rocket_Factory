const bubbleSort = (arr) => {
  const length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
};

const chooseSort = (arr) => {
  const length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    let minValue = arr[i];
    let minIndex = i;
    for (j = i + 1; j < length; j++) {
      if (minValue > arr[j]) {
        minIndex = j;
        minValue = arr[j];
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
};

const insertSort = (arr) => {
  const length = arr.length;
  for (let i = 1; i < length; i++) {
    let temp = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
};

const quickSort = (arr) => {
  function _quickSort(arr, start, end) {
    if (arr.length === 0 || !arr || start >= end) return;
    let left = start;
    let right = end;
    let temp = arr[end];
    while (left < right) {
      while (left < right && arr[left] <= temp) {
        left++;
      }
      [arr[left], arr[right]] = [arr[right], arr[left]];
      while (left < right && arr[right] >= temp) {
        right--;
      }
      [arr[left], arr[right]] = [arr[right], arr[left]];
    }
    arr[left] = temp;
    _quickSort(arr, start, left - 1);
    _quickSort(arr, right + 1, end);
  }
  _quickSort(arr, 0, arr.length - 1);
};
