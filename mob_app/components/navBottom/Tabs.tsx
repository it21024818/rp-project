import * as React from "react";

import { DotSize, TabTwoAppearanceOptions, TabButtonLayout } from '../../types';
import {
    TabRouter,
    createNavigatorFactory,
    useNavigationBuilder,
} from "@react-navigation/native";

import TabBarThreeElement from "./TabBarElement";

const defaultAppearance: TabTwoAppearanceOptions = {
    topPadding: 10,
    bottomPadding: 10,
    horizontalPadding: 10,
    tabBarBackground: "#FFFFFF",
    dotSize: DotSize.SMALL,
    tabButtonLayout: TabButtonLayout.VERTICAL,
    activeColors: undefined,
    activeTabBackgrounds: undefined,
};

const defaultTabBarOptions = {
    activeTintColor: "black",
    inactiveTintColor: "black",
    activeBackgroundColor: "#FFCF64",
    labelStyle: {

    },
};

interface IBerlinTabBarNavigatorProps {
    initialRouteName?: string;
    backBehavior?: "history" | "initialRoute" | "order" | "none" | undefined;
    children: React.ReactNode;
    screenOptions?: any;
    tabBarOptions?: any;
    appearance: Partial<TabTwoAppearanceOptions>;
}

const BerlinTabBarNavigator = ({
                                initialRouteName,
                                backBehavior,
                                children,
                                screenOptions,
                                tabBarOptions,
                                appearance,
                                ...rest
                            }: IBerlinTabBarNavigatorProps) => {

    const { state, descriptors, navigation } = useNavigationBuilder(TabRouter, {
        initialRouteName,
        backBehavior,
        children,
        screenOptions,
    });

    const finalAppearance: TabTwoAppearanceOptions = {
        ...defaultAppearance,
        ...appearance
    }

    const finalTabBarOptions = {
        ...defaultTabBarOptions,
        ...tabBarOptions
    }

    return (
        <TabBarThreeElement
            {...rest}
            state={state}
            navigation={navigation}
            descriptors={descriptors}
            tabBarOptions={finalTabBarOptions}
            appearance={finalAppearance}
        />
    );
}

BerlinTabBarNavigator.defaultProps = {
    lazy: true,
};

//Custom navigators need to wrap the navigator component in createNavigatorFactory before exporting.
export default createNavigatorFactory(BerlinTabBarNavigator);