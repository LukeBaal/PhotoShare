import { orderBy } from 'lodash';
import React, { Component } from 'react';

import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  ClearRefinements,
  RefinementList,
  Configure
} from 'react-instantsearch-dom';
import ImageHit from './ImageHit';

interface SearchState {
  indexName: string;
  showResults: boolean;
}

export class Search extends Component<{}, SearchState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      indexName: 'tags',
      showResults: false
    };
  }

  searchChanged = (query: any) => {
    if (query.length) {
      this.setState({ showResults: true });
    } else {
      this.setState({ showResults: false });
    }
  };

  render() {
    return (
      <div>
        <InstantSearch
          appId={process.env.REACT_APP_ALGOLIA_APPID}
          apiKey={process.env.REACT_APP_ALGOLIA_APIKEY}
          indexName="tags"
        >
          <div className="row">
            <div className="col-md-2">
              <ClearRefinements />
              <h3>Labels</h3>
              <RefinementList
                attribute="labels.description"
                operator="and"
                showMore={true}
                transformItems={(items: any[]) => {
                  return orderBy(items, ['count', 'label'], ['desc', 'asc']);
                }}
              />
              <Configure hitsPerPage={8} />
            </div>
            <div className="col-md-10">
              <SearchBox onChange={this.searchChanged} />
              <Hits hitComponent={ImageHit} />
              <Pagination className="mb-5" />
            </div>
          </div>
        </InstantSearch>
      </div>
    );
  }
}

export default Search;
