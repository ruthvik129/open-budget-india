import React from "react";
import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const ValueFilter = ({ filter, onCancel }) => {
  return (
    <EuiFlexItem grow={false}>
      <EuiButton
        iconSide="right"
        iconType="cross"
        onClick={() => onCancel(filter.id)}
      >
        {filter.label}: {filter.value}
      </EuiButton>
    </EuiFlexItem>
  );
};

export const SelectedFilters = ({ data, onCancel }) => {
  return (
    <EuiFlexGroup gutterSize="s" alignItems="center">
      {data?.map((filter, index) => {
        const FilterComponent = ValueFilter;
        return (
          <FilterComponent filter={filter} onCancel={onCancel} key={index} />
        );
      })}
    </EuiFlexGroup>
  );
};
