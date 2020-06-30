import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Layout from './Layout';
import Home from './Home';

const Router = () => {
  return (
    <Layout>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Switch>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Layout>
  );
};

export default Router;
