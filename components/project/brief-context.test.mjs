import assert from 'node:assert/strict';
import test from 'node:test';
import React, { useContext } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BriefContext } from './brief-context.ts';

test('retained provider supplies a newly created consumer after component refresh', () => {
  const openBrief = () => {};
  const RetainedProvider = ({ children }) => React.createElement(BriefContext.Provider, { value: openBrief }, children);
  // Refresh recreates component functions while their standalone context stays shared.
  const consumer = () => function RefreshedTrigger() {
    const value = useContext(BriefContext);
    assert.equal(value, openBrief);
    return React.createElement('button', null, 'Start project');
  };
  for (let refresh = 0; refresh < 3; refresh++) {
    assert.equal(renderToStaticMarkup(React.createElement(RetainedProvider, null, React.createElement(consumer()))), '<button>Start project</button>');
  }
});

test('missing provider remains detectable instead of silently dropping clicks', () => {
  function UnwrappedTrigger() {
    assert.equal(useContext(BriefContext), null);
    return null;
  }
  renderToStaticMarkup(React.createElement(UnwrappedTrigger));
});
