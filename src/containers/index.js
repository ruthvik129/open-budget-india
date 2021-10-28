import React from 'react';

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiCard,
    EuiIcon,
    EuiFlexGroup,
    EuiFlexItem,
} from '@elastic/eui';

import { Link } from 'react-router-dom'

const Cards = [
    {
        title: 'View all Datasets',
        description: "Search and filter available datasets",
        icon: 'dashboardApp',
        path:'/datasets'
    },
    {
        title: 'Union Budget India Visualisation',
        description: "Union Budget at a glance",
        icon: 'dataVisualizer',
        path:'/visualisation'
    }

];

const cardNodes = Cards.map(function (item, index) {
    return (
        <EuiFlexItem key={index}>
            <Link to={item.path}>
                <EuiCard
                    icon={<EuiIcon size="xl" type={`${item.icon}`} />}
                    title={`${item.title}`}
                    description={`${item.description}`}
                />
            </Link>
        </EuiFlexItem>
    );
});

export default () => (
    <EuiPage>
        <EuiPageBody component="div">
            <EuiPageContent>
                <EuiPageContentHeader>
                    <EuiPageContentHeaderSection>
                        <EuiTitle>
                            <h2>Open Budget India</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                    <EuiFlexGroup gutterSize="l">
                        {cardNodes}
                    </EuiFlexGroup>
                </EuiPageContentBody>
            </EuiPageContent>
        </EuiPageBody>
    </EuiPage>
)


