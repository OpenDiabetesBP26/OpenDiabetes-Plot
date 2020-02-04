import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Tooltip } from 'react-bootstrap';

const LinkWithTooltip extends Component({
  render() {
    let tooltip = <Tooltip id={this.props.id}>{this.props.tooltip}</Tooltip>;

    return (
      <OverlayTrigger
        overlay={tooltip} placement="top"
        delayShow={300} delayHide={150}
      >
        <a href={this.props.href}>{this.props.children}</a>
      </OverlayTrigger>
    );
  }
});