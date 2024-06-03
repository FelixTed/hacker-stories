import * as React from 'react';
import "./App.css";

const SortButtons = ({ onTopicSort, onUpvotesSort, onCommentsSort, sortState }) => {
  const topicArrow = (sortState) => {
    if (sortState.currentSort === "TOPIC") {
      return sortState.topicSortState === 1 ? '⇧' : '⇩';
    } else {
      return "";
    }
  };
  const upvoteArrow = (sortState) => {
    if (sortState.currentSort === "UPVOTE") {
      return sortState.upvotesSortState === 1 ? '⇧' : '⇩';
    } else {
      return "";
    }
  };
  const commentArrow = (sortState) => {
    if (sortState.currentSort === "COMMENT") {
      return sortState.commentsSortState === 1 ? '⇧' : '⇩';
    } else {
      return "";
    }
  };
  return (
    <div>
      <button className='button' onClick={onTopicSort}>Topic {topicArrow(sortState)}</button>
      <button className='button' onClick={onUpvotesSort}>Upvotes {upvoteArrow(sortState)}</button>
      <button className='button' onClick={onCommentsSort}>Comments {commentArrow(sortState)}</button>
    </div>
  );
};

export { SortButtons };
