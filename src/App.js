import * as React from 'react';
import axios from 'axios';
import './App.css';
import styled from 'styled-components';
import { SiCreatereactapp } from 'react-icons/si';

import { SearchForm } from './SearchForm';
import { List } from './List';
import { SortButtons } from './SortButtons';
import { LastSearches } from './LastSearches';

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data:
          action.payload.page === 0
          ? action.payload.list
          :state.data.concat(action.payload.list),

        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter((story) => action.payload.objectID !== story.objectID),
      };
    default:
      throw new Error();
  }
};

const initialState = {
  upvotesSortState: 1,
  commentsSortState: 1,
  topicSortState: 1,
  currentSort: 'BASE',
};

const sortReducer = (state, action) => {
  switch (action.type) {
    case 'upvoteSort':
      return {
        ...state,
        upvotesSortState: state.upvotesSortState * -1,
        currentSort: 'UPVOTE',
      };
    case 'commentSort':
      return {
        ...state,
        commentsSortState: state.commentsSortState * -1,
        currentSort: 'COMMENT',
      };
    case 'topicSort':
      return {
        ...state,
        topicSortState: state.topicSortState * -1,
        currentSort: 'TOPIC',
      };
    case 'base':
      return {
        ...state,
        currentSort: 'BASE',
      };
    default:
      throw new Error('Unknown action type');
  }
};

const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};


const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const getSumComments = (stories) => {
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

const extractSearchTerm = (url) => {
  const queryParam = url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'));
  return queryParam.replace(`${PARAM_SEARCH}`, '');
};

const getLastSearches = (urls) =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1);

const getUrl = (searchTerm, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm, 0);
    event.preventDefault();
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const [sortState, setSortState] = React.useReducer(sortReducer, initialState);

  const handleUpvotesSort = () => {
    setSortState({ type: 'upvoteSort' });
  };

  const handleCommentSort = () => {
    setSortState({ type: 'commentSort' });
  };

  const handleTopicSort = () => {
    setSortState({ type: 'topicSort' });
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const lastSearches = getLastSearches(urls);

  const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

  return (
<div className='container'>
      <StyledHeadlinePrimary>
        Welcome to my first React app with {sumComments} comments.&nbsp;
        <SiCreatereactapp />
      </StyledHeadlinePrimary>
      
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
      <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch} />
      <SortButtons onUpvotesSort={handleUpvotesSort} onCommentsSort={handleCommentSort} onTopicSort={handleTopicSort} sortState={sortState} />
      <hr />
      
      {stories.isError && <p>Something went wrong...</p>}
      <List list={stories.data} sortState={sortState} onRemoveItem={handleRemoveStory} />
      <div  className='button-container'>
        {stories.isLoading ? (
          <p>Loading ...</p>
        ) : (
          <button className='button' type='button' onClick={handleMore}>More</button>
        )}
      </div>
    </div>
  );
};

export default App;
