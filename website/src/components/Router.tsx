import React from 'react';
import EventNames from 'EventNames';
import Events from './../Events';
import AboutPage from 'pages/AboutPage';
import BlogPage from 'pages/BlogPage';
import HomePage from 'pages/HomePage';
import BlogArchive from './BlogArchive';

interface RouterState {
    route?: string;
}

export default class Router extends React.Component<React.PropsWithChildren, RouterState> {

    state: RouterState = {
        route: window.location.pathname
    };

    componentDidMount(): void {
        window.addEventListener('popstate', this.handleBrowserBackButton);
        Events.on(EventNames.ROUTE_CHANGE, this.changeRoute);
    }

    componentWillUnmount(): void {
        window.removeEventListener('popstate', this.handleBrowserBackButton);
        Events.off(EventNames.ROUTE_CHANGE, this.changeRoute);
    }

    handleBrowserBackButton = (e: Event): void => {
        const { pathname } = window.location;
        this.setState({ route: pathname });
    }

    changeRoute = (e: Event): void => {
        const ce = e as CustomEvent;
        const route = ce.detail.route;

        if (route !== this.state.route) {
            window.history.pushState({}, '', ce.detail.route);
            this.setState({ route: ce.detail.route });
        }
    }

    render() {
        const { route = '' } = this.state;

        const cleanRoute = route.trim();
        const question = cleanRoute.indexOf('?');
        const path = question > -1 ? cleanRoute.substring(0, question) : cleanRoute;

        switch (path) {
            case '':
            case '/':
                return <HomePage />

            case '/about':
                return <AboutPage />

            case '/blog':
                return <BlogPage />

            case '/blogArchive':
                return <BlogArchive />

            default:
                return <h1>Page not found</h1>
        }
    }

}
