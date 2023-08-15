import React from 'react';
import EventNames from 'EventNames';
import Events from './../Events';

interface LinkProps extends React.PropsWithChildren {
    route?: string;
    href: string;
    className?: string;
}

export default class Link extends React.PureComponent<LinkProps> {

    handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const { route, href } = this.props;
        Events.emit(EventNames.ROUTE_CHANGE, { route: route || href });
    }

    render() {
        const { route, href = '#', children, ...rest } = this.props;
        return <a href={href} onClick={this.handleClick} {...rest}>{children}</a>
    }

}
