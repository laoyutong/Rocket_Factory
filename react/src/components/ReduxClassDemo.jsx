import React, { Component } from "react";
import { connect } from "../react-redux";

class ReduxClassDemo extends Component {
  render() {
    const { count, name, add, set } = this.props;
    return (
      <div>
        <div>
          class count: {count}
          <div>
            <button onClick={add}>++</button>
          </div>
        </div>
        <div>
          class name:{name}
          <div>
            <button
              onClick={() => {
                set("凹凸曼");
              }}
            >
              change
            </button>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ count, name }) {
  return {
    count,
    name,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    add: () => dispatch({ type: "ADD" }),
    set: (name) => dispatch({ type: "SET", payload: name }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ReduxClassDemo);
