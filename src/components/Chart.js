import React, { PureComponent } from "react";
import {
  Bar,
  XAxis,
  Line,
  ComposedChart,
  YAxis,
  ReferenceDot,
  Tooltip
} from "recharts";

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
        <ReferenceDot
          x="1"
          y={85}
          alwaysShow
          label="Threshold"
          stroke="none"
          fill="none"
        />
        <Tooltip viewBox={{ x: 0, y: 0, width: 200, height: 200 }} />
        <Line dot={false} type="monotone" dataKey="threshold" stroke="black" />
      </ComposedChart>
    );
  }
}
