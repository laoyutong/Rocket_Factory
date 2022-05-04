import { createRef, Component, Fragment } from "react";

const createListComponent = ({
  getEstimatedTotalSize,
  getItemSize,
  getItemOffset,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps,
}) => {
  return class extends Component {
    instanceProps = initInstanceProps?.(this.props);
    static defaultProps = {
      overscanCount: 2,
    };

    state = {
      scrollOffset: 0,
    };

    itemStyleCache = new Map();

    outerRef = createRef();
    firstRef = createRef();
    lastRef = createRef();
    oldFirstRef = createRef();
    oldLastRef = createRef();

    observe = (dom) => {
      const io = new IntersectionObserver(this.onScroll, {
        root: this.outerRef.current,
      });
      io.observe(dom);
    };

    componentDidMount() {
      this.observe((this.oldFirstRef.current = this.firstRef.current));
      this.observe((this.oldLastRef.current = this.lastRef.current));
    }

    componentDidUpdate() {
      if (!this.oldFirstRef.current !== this.firstRef.current) {
        this.observe(this.firstRef.current);
      }
      if (!this.oldLastRef.current !== this.lastRef.current) {
        this.observe(this.lastRef.current);
      }
    }

    getItemStyle = (index) => {
      let style;
      if (this.itemStyleCache.has(index)) {
        style = this.itemStyleCache.get(index);
      } else {
        style = {
          position: "absolute",
          width: "100%",
          height: getItemSize(this.props, index, this.instanceProps),
          top: getItemOffset(this.props, index, this.instanceProps),
        };
        this.itemStyleCache.set(index, style);
      }
      return style;
    };

    getRangeToRender = () => {
      const { scrollOffset } = this.state;
      const { overscanCount, itemCount } = this.props;
      const startIndex = getStartIndexForOffset(
        this.props,
        scrollOffset,
        this.instanceProps
      );
      const stopIndex = getStopIndexForStartIndex(
        this.props,
        startIndex,
        this.instanceProps
      );
      return [
        Math.max(0, startIndex - overscanCount),
        Math.min(stopIndex + overscanCount, itemCount - 1),
        startIndex,
        stopIndex,
      ];
    };

    onScroll = () => {
      const { scrollTop } = this.outerRef.current;
      this.setState({ scrollOffset: scrollTop });
    };

    render = () => {
      const { width, height, itemCount, children: ComponentType } = this.props;

      const containerStyle = {
        width,
        height,
        position: "relative",
        overflow: "auto",
        willChange: "transform",
      };

      const contentStyle = {
        width: "100%",
        height: getEstimatedTotalSize(this.props, this.instanceProps),
      };

      const items = [];

      if (itemCount > 0) {
        const [startIndex, stopIndex, originStartIndex, originStopIndex] =
          this.getRangeToRender();
        for (let i = startIndex; i <= stopIndex; i++) {
          const style = this.getItemStyle(i);
          if (originStartIndex === i) {
            items.push(
              <Fragment key={i}>
                <span
                  style={{ ...style, width: 0, height: 0 }}
                  ref={this.firstRef}
                />
                <ComponentType index={i} style={style} />
              </Fragment>
            );
          } else if (originStopIndex === i) {
            items.push(
              <Fragment key={i}>
                <span
                  style={{ ...style, width: 0, height: 0 }}
                  ref={this.lastRef}
                />
                <ComponentType index={i} style={style} />
              </Fragment>
            );
          } else {
            items.push(<ComponentType key={i} index={i} style={style} />);
          }
        }
      }

      return (
        <div style={containerStyle} ref={this.outerRef}>
          <div style={contentStyle}>{items}</div>
        </div>
      );
    };
  };
};

export default createListComponent;
