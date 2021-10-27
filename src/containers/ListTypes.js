import React from "react";
import { EuiFlexItem, EuiFlexGroup, EuiTitle, EuiText } from "@elastic/eui";

export const List = ({ data }) => (
  <>
    {data?.map((item) => (
      <EuiFlexGroup gutterSize="xl" key={item.id}>
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={4}>
              <EuiTitle size="xs">
                <h6>{item.title}</h6>
              </EuiTitle>
              <EuiText grow={false}>
                <p>{item.notes}</p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    ))}
  </>
);
