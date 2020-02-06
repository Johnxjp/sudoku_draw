import React, { PureComponent } from "react";
import { Bar, XAxis, Line, ComposedChart, YAxis } from "recharts";

export default class ProbabilityChart extends PureComponent {
  render() {
    return (
      <ComposedChart
        width={230}
        height={200}
        data={this.props.data}
        style={{ fontSize: 10, paddingTop: 10 }}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <XAxis dataKey="name" />
        <YAxis hide={true} domain={[0, 100]} />
        <Bar dataKey="probability" barSize={20} fill="#29b6f6" />
        <Line dot={false} type="monotone" dataKey="threshold" stroke="black" />
      </ComposedChart>
    );
  }
}
