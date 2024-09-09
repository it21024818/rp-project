import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import FeedbackList from 'src/content/feedbacks/feedbacksList';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Dashboards

const Dashboard = Loader(lazy(() => import('src/content/dashboards/Dash')));

// Predictions

const PredictionsAnalytics = Loader(
  lazy(() => import('src/content/predictions/predictionsAnalytics'))
);

const PredictionsLists = Loader(
  lazy(() => import('src/content/predictions/predictionsList'))
);

const PredictionInside = Loader(
  lazy(() => import('src/content/predictions/predictionsDetails'))
);

// Feedbacks

const FeedbackAnalytics = Loader(
  lazy(() => import('src/content/feedbacks/feedbacksAnalytics'))
);

const FeedbackLists = Loader(
  lazy(() => import('src/content/feedbacks/feedbacksList'))
);

// Users

const UsersLists = Loader(lazy(() => import('src/content/users')));

const UsersInside = Loader(
  lazy(() => import('src/content/users/usersDetails'))
);

// User Profile

const UserProfile = Loader(lazy(() => import('src/content/profile')));

// News Source List

const NewsSourceLists = Loader(lazy(() => import('src/content/newsSources')));

const NewsSourceInside = Loader(
  lazy(() => import('src/content/newsSources/newsSourceDetails'))
);

// Components

const Buttons = Loader(
  lazy(() => import('src/content/pages/Components/Buttons'))
);
const Modals = Loader(
  lazy(() => import('src/content/pages/Components/Modals'))
);
const Accordions = Loader(
  lazy(() => import('src/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(
  lazy(() => import('src/content/pages/Components/Badges'))
);
const Tooltips = Loader(
  lazy(() => import('src/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
  lazy(() => import('src/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Reports

const ReportsIndex = Loader(lazy(() => import('src/content/roports')));

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ]
  },
  {
    path: 'predictions',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="analytics" replace />
      },
      {
        path: 'analytics',
        element: <PredictionsAnalytics />
      },
      {
        path: 'list',
        element: <PredictionsLists />
      },
      {
        path: 'details/:id',
        element: <PredictionInside />
      }
    ]
  },
  {
    path: 'feedback',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="analytics" replace />
      },
      {
        path: 'analytics',
        element: <FeedbackAnalytics />
      },
      {
        path: 'list',
        element: <FeedbackLists />
      }
    ]
  },
  {
    path: 'users',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="list" replace />
      },
      {
        path: 'list',
        element: <UsersLists />
      },
      {
        path: 'details/:id',
        element: <UsersInside />
      }
    ]
  },
  {
    path: 'profile',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="profile" replace />
      },
      {
        path: 'profile',
        element: <UserProfile />
      }
    ]
  },
  {
    path: 'sources',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="list" replace />
      },
      {
        path: 'list',
        element: <NewsSourceLists />
      },
      {
        path: 'details/:id',
        element: <NewsSourceInside />
      }
    ]
  },
  {
    path: 'reports',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="details" replace />
      },
      {
        path: 'details',
        element: <ReportsIndex />
      }
    ]
  },
  {
    path: '/components',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="buttons" replace />
      },
      {
        path: 'buttons',
        element: <Buttons />
      },
      {
        path: 'modals',
        element: <Modals />
      },
      {
        path: 'accordions',
        element: <Accordions />
      },
      {
        path: 'tabs',
        element: <Tabs />
      },
      {
        path: 'badges',
        element: <Badges />
      },
      {
        path: 'tooltips',
        element: <Tooltips />
      },
      {
        path: 'avatars',
        element: <Avatars />
      },
      {
        path: 'cards',
        element: <Cards />
      },
      {
        path: 'forms',
        element: <Forms />
      }
    ]
  }
];

export default routes;
