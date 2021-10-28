import React, { useState, useEffect } from "react";
import axios from "axios";
import { capitalize, isEmpty } from "lodash";

import { List } from "./ListTypes";
import { SelectedFilters } from "../Components/SelectedFilters";
import { PAGE_COUNT } from "../constants";
import { CKAN_API_ENDPOINT } from "../constants";


import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonGroup,
  EuiFacetButton,
  EuiFacetGroup,
  EuiPagination,
  EuiFieldSearch,
} from "@elastic/eui";

const Main = () => {
  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const [facetList, setFacetList] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [facetValue, setFacetValue] = useState("");
  const [facetValueArray, setFacetValueArray] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const [userAction, setuserAction] = useState("");

  const [activePageNumber, setActivePage] = useState(0);

  const filterElements = ["organization", "groups", "tags"];
  const TOTAL_PAGE_COUNT = data?.result?.count;

  let cancelToken = axios.CancelToken.source();
  
    /* ----- Utility functions-----   */

  const allFirstToUC = (strToArr) =>
    strToArr.map((word) => word[0].toUpperCase() + word.substring(1));

  const formFacetURL = () => {
    let formFacetPair = filterType !== '' ?  `${filterType}:${facetValue}` : null;
    if (facetValueArray.length !== 0 && filterType!== '') {
      formFacetPair = `+${filterType}:${facetValue}`;
    }

    let facetArray = [...facetValueArray];

    facetArray.push(formFacetPair);
    setFacetValueArray(facetArray);
    return facetArray.map((facet) => facet).join("");
  };

  const formDatasetFetchUrl = () => {
    let url;
    switch (userAction) {
      case "search":
        url = `${CKAN_API_ENDPOINT}?q=${value}&start=${
          activePageNumber * PAGE_COUNT
        }&rows=${PAGE_COUNT}`;
        break;

      case "facet":
      case "facet-removed":
        url = `${CKAN_API_ENDPOINT}?fq=${formFacetURL()}&start=${
          activePageNumber * PAGE_COUNT
        }&rows=${PAGE_COUNT}`;
        break;

      default:
        url = `${CKAN_API_ENDPOINT}?start=${
          activePageNumber * PAGE_COUNT
        }&rows=${PAGE_COUNT}`;
    }
    return url;
  };

  /* ----- End of Utility functions-----   */

  // To fetch the related filter fields
  useEffect(() => {
    let url = `${CKAN_API_ENDPOINT}?facet.field=["tags","groups","organization"]&facet.limit=10&rows=0`;

    if (userAction === "facet" || userAction === 'facet-removed') {
      url = `${CKAN_API_ENDPOINT}?facet.field=["tags","groups","organization"]&fq=${formFacetURL()}&facet.limit=10&rows=0`;
    }

    axios
      .get(url)
      .then((response) => {
        setFacetList(response.data?.result?.facets);
      })
      .catch((error) => {});
  }, [facetValue, filterType, userAction]);

  // To fetch the datasets based on the use actions
  useEffect(() => {
    axios
      .get(formDatasetFetchUrl(), { cancelToken: cancelToken.token })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  }, [activePageNumber, userAction, filterType, value]);

  const entries = (type) => {
    let FacetButtons = [];
    Object.entries(facetList[type]).forEach(([key, value]) => {
      FacetButtons.push(
        <EuiFacetButton
          key={type}
          id={`${type}`}
          quantity={value}
          isSelected={facetValue === key}
          // isLoading={loading}
          onClick={() => facetClicked(type, key)}
        >
          {allFirstToUC(key.split("-")).join(" ")}
        </EuiFacetButton>
      );
    });
    return FacetButtons;
  };

  const formFacetDataList = (type) => {
    return (
      <>
        <EuiTitle size="xxs">
          <h3>{capitalize(type)}</h3>
        </EuiTitle>
        <EuiFacetGroup>{entries(type)}</EuiFacetGroup>
      </>
    );
  };

  const facetClicked = (type, key) => {
    let facetItem = key;
    if (type == "tags") {
      facetItem = `"${key}"`;
    }
    setFilterType(type);
    setFacetValue(facetItem);
    setuserAction("facet");
    const filters = [...appliedFilters];
    filters.push({
      label: capitalize(type),
      value: allFirstToUC(key.split("-")).join(" "),
      id: `${type}:${key}`,
    });
    setAppliedFilters(filters);
  };

  const removeFilter = (selectedFilter) => {
    const facetValueFilters = [...facetValueArray];
    const filterValues = [...appliedFilters];
    const selectFilterValueIndex = filterValues.indexOf(
      (data) => data.id === selectedFilter
    );
    filterValues.splice(selectFilterValueIndex, 1);
    setAppliedFilters(filterValues);

    let SelectedFilterindex = facetValueFilters.indexOf(selectedFilter);
    facetValueFilters.splice(SelectedFilterindex, 1);
    setFacetValueArray(facetValueFilters);
    setFilterType("")
    setFacetValue("")
    filterValues.length === 0 ? setuserAction("") : setuserAction("facet-removed");
  };

  const goToPage = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const onChange = (e) => {
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = axios.CancelToken.source();

    setValue(e.target.value);
    setuserAction("search");
  };

  return (
    <EuiPage>
      <EuiPageSideBar>
        <EuiFieldSearch
          placeholder="Search for Datasets... "
          value={value}
          onChange={(e) => onChange(e)}
          isClearable={true}
        />
        <EuiHorizontalRule margin="m" />
        <EuiFacetGroup style={{ maxWidth: 200 }}>
          {filterElements.map(
            (item) => !isEmpty(facetList) && formFacetDataList(item)
          )}
        </EuiFacetGroup>
      </EuiPageSideBar>

      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters
                onCancel={(filter) => {
                  removeFilter(filter);
                }}
                data={appliedFilters}
              />
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>

        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="s">
                <h2>{data?.result?.count} datasets found</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <List data={data?.result?.results} />

            <EuiFlexGroup justifyContent="spaceAround">
              <EuiFlexItem grow={false}>
                <EuiPagination
                  pageCount={Math.ceil(TOTAL_PAGE_COUNT / PAGE_COUNT)}
                  activePage={activePageNumber}
                  onPageClick={(activePage) => goToPage(activePage)}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};

export default Main;
