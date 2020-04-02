import Label from "reactstrap/es/Label";
import React from "react";
import {Badge, Button, Col, FormGroup, ListGroupItem} from "reactstrap";

export function PlainLabel({size = 'md', children}) {
  return (
    <Label {...{size}} className="my-auto py-1">
      {children}
    </Label>
  );
}

export function BlockLabel({size = 'md', children}) {
  return (
    <Label {...{size}} className="my-auto py-1 d-block">
      {children}
    </Label>
  );
}

export function BoldLabel({size = 'sm', children}) {
  return (
    <Label {...{size}} className="my-auto py-1 font-weight-bold">
      {children}
    </Label>
  );
}

export function FormRow(props) {
  return (
    <FormGroup row>{props.children}</FormGroup>
  );
}

export function FormPropertyColumn({children, ...rest}) {
  return (
    <Col {...rest} className="text-right my-auto">{children}</Col>
  );
}

export function FormValueColumn({children, ...rest}) {
  return (
    <Col {...rest} className="border-left my-auto">{children}</Col>
  );
}

export function PlainColumn({children, ...rest}) {
  return (
    <Col {...rest} className="my-auto">{children}</Col>
  );
}

export function TagBadge({toDelete, children}) {
  return (
    <Badge color="white" className="mb-1 mr-2 py-0 d-inline-block border">
      {toDelete?
        (
          <Button
            color="danger" className="py-0 px-1 m-1" size="sm"
            onClick={toDelete}>
            <i className="fa fa-remove font-sm" />
          </Button>
        ):
        <React.Fragment/>}
      <span className="m-1 align-middle font-weight-lighter">
        <PlainLabel size={'sm'}>{children}</PlainLabel>
      </span>
    </Badge>
  );
}

export function TagOption({toDelete, toSelect, children}) {
  return (
    <ListGroupItem className="border-0 p-0" onClick={toSelect}>
      <TagBadge toDelete={toDelete}>
        {children}
      </TagBadge>
    </ListGroupItem>
  );
}
